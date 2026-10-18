import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import markdownIt from "markdown-it";
import taskLists from "markdown-it-task-lists";
import markdownItAttrs from "markdown-it-attrs";

import pluginFilters from "./_config/filters.js";
import wikilinkPlugin from "./_config/wikilinks.js";
import { simplifySlug, slugifyFilePath } from "./_config/slugs.js";
import metadata from "./_data/metadata.js";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function(eleventyConfig) {
	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if (data.draft) {
			data.title = `${data.title} (draft)`;
		}

		if(data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});

	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig
		.addPassthroughCopy({
			"./public/": "/"
		})
		.addPassthroughCopy("./content/feed/pretty-atom-feed.xsl")
		.addPassthroughCopy({
			"content/Blogs/images/inside-the-chip-8-virtual-machine/": "blogs/inside-the-chip-8-virtual-machine/images/inside-the-chip-8-virtual-machine/"
		});

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch CSS files
	eleventyConfig.addWatchTarget("css/**/*.css");
	// Watch images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpg,jpeg,gif}");

	// Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
	// Bundle <style> content and adds a {% css %} paired shortcode
	eleventyConfig.addBundle("css", {
		toFileDirectory: "dist",
		// Add all <style> content to `css` bundle (use <style eleventy:ignore> to opt-out)
		// Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
		bundleHtmlContentFromSelector: "style",
	});

	// Bundle <script> content and adds a {% js %} paired shortcode
	eleventyConfig.addBundle("js", {
		toFileDirectory: "dist",
		// Add all <script> content to `js` bundle (use <script eleventy:ignore> to opt-out)
		// Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
		bundleHtmlContentFromSelector: "script",
	});

	// Markdown: Obsidian wikilinks + GFM task list checkboxes
	let slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
	try {
		slugify = eleventyConfig.getFilter("slugify");
	} catch {}
	const mdLib = markdownIt({ html: true })
		.use(taskLists)
		.use(markdownItAttrs)
		.use(wikilinkPlugin, { slugify });
	eleventyConfig.setLibrary("md", mdLib);

	// Official plugins
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(HtmlBasePlugin);
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

	const feedMetadata = {
		language: metadata.language,
		title: metadata.title,
		subtitle: metadata.description,
		base: metadata.url,
		author: {
			name: metadata.author.name
		}
	};

	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom",
		outputPath: "/feed/feed.xml",
		stylesheet: "pretty-atom-feed.xsl",
		templateData: {
			eleventyNavigation: {
				key: "Feed",
				order: 4
			}
		},
		collection: {
			name: "posts",
			limit: 10,
		},
		metadata: feedMetadata
	});

	// Old Quartz RSS path, keeps existing subscribers working
	eleventyConfig.addPlugin(feedPlugin, {
		type: "rss",
		outputPath: "/index.xml",
		collection: {
			name: "posts",
			limit: 10,
		},
		metadata: feedMetadata
	});

	// Image optimization: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// Output formats for each image.
		formats: ["webp"],

		// Responsive widths (the image transform uses `sizes` to pick one).
		widths: [640, 1280],
		sizes: "(min-width: 40em) 40em, 100vw",

		failOnError: false,
		htmlOptions: {
			imgAttributes: {
				loading: "lazy",
				decoding: "async",
			}
		},

		sharpOptions: {
			animated: true,
		},

		// Skip already-optimized WebP sources (e.g. converted animated GIFs)
		skipFile: (filepath) => filepath.endsWith(".webp"),

		// Diagrams/screenshots (line art, text) look soft when encoded lossily,
		// but lossless WebP can balloon on photographic sources. So: try
		// lossless first and keep it when it stays small, otherwise fall back
		// to lossy (which is what photos/animations need).
		formatHooks: {
			webp: async function(sharpInstance) {
				const targetWidth = this.width;
				const factor = targetWidth <= 200 ? 3 : (targetWidth <= 480 ? 2 : 1);
				const pipeline = factor > 1
					? sharpInstance.clone().resize({ width: targetWidth * factor, kernel: "lanczos3" }).sharpen({ sigma: 0.6 })
					: sharpInstance.clone();

				const lossless = await pipeline.webp({ lossless: true, effort: 6 }).toBuffer();
				if(lossless.length <= 300 * 1024) {
					return lossless;
				}
				return pipeline.webp({ quality: 90, effort: 6 }).toBuffer();
			},
		},
	});

	// Filters
	eleventyConfig.addPlugin(pluginFilters);

	eleventyConfig.addPlugin(IdAttributePlugin, {
		// by default we use Eleventy’s built-in `slugify` filter:
		// slugify: eleventyConfig.getFilter("slugify"),
		// selector: "h1,h2,h3,h4,h5,h6", // default
	});

	// Posts: dated writing in Blogs/, CTFs/ and Life Updates/
	eleventyConfig.addCollection("posts", (collectionApi) =>
		collectionApi.getAll()
			.filter(item => item.data.isPost && item.date instanceof Date && !isNaN(item.date))
			.sort((a, b) => a.date - b.date)
	);

	// Old Quartz aliases (e.g. /chip8/, /pool_allocators/) -> redirect pages
	eleventyConfig.addCollection("aliasRedirects", (collectionApi) => {
		const seen = new Set();
		const redirects = [];
		for(const page of collectionApi.getAll()) {
			const aliases = [...(page.data.alias || []), ...(page.data.aliases || [])];
			for(const raw of aliases) {
				if(typeof raw !== "string" || !raw.trim()) {
					continue;
				}
				const slug = simplifySlug(slugifyFilePath(raw.trim()));
				const url = slug === "" ? "/" : `/${slug}/`;
				if(url === page.url || seen.has(url)) {
					continue;
				}
				seen.add(url);
				redirects.push({ url, target: page.url, title: page.data.title });
			}
		}
		return redirects;
	});

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});

	// Transform: rewrite image src to use wsrv.nl CDN in production
	if (process.env.ELEVENTY_RUN_MODE === "build") {
		eleventyConfig.addTransform("wsrv-images", async (content, outputPath) => {
			if (!outputPath.endsWith(".html")) return content;
			
			// Compute the page's base URL (directory) for resolving relative image paths
			const pathPrefix = "/blog";
			// Remove _site prefix and file name to get the page's directory path
			const pageDir = outputPath
				.replace(/^\.\/_site[\/\\]/, "")  // handle ./_site/ prefix
				.replace(/\/index\.html$/, "")
				.replace(/\/[^/]+\.html$/, "");
			const pageBaseUrl = `https://syswraith.github.io${pathPrefix}/${pageDir}/`;
			
			// Helper to check if a file is likely animated (GIF or animated WebP)
			function isAnimatedImage(src) {
				const ext = src.toLowerCase().split('.').pop();
				return ext === 'gif' || (ext === 'webp' && src.includes('badapple') || src.includes('sierpski') || src.includes('maze') || src.includes('tetris') || src.includes('breakout'));
			}

			return content.replace(/src="([^"]+\.(?:webp|png|jpg|jpeg|gif|svg))"/g, (match, src) => {
				// Skip external URLs, data URIs
				if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
					return match;
				}
				// Skip animated images - don't use wsrv.nl for them
				if (isAnimatedImage(src)) {
					return match;
				}
				// Handle absolute paths starting with /blog/ - convert to full URL
				if (src.startsWith("/blog/")) {
					const imageUrl = `https://syswraith.github.io${src}`;
					const wsrvUrl = `https://wsrv.nl/?url=${encodeURIComponent(imageUrl)}&w=640&q=80&output=webp`;
					return `src="${wsrvUrl}"`;
				}
				// Skip other absolute paths (like /dist/)
				if (src.startsWith("/")) {
					return match;
				}
				// Resolve relative image URL against page base
				const imageUrl = new URL(src, pageBaseUrl).href;
				const wsrvUrl = `https://wsrv.nl/?url=${encodeURIComponent(imageUrl)}&w=640&q=80&output=webp`;
				return `src="${wsrvUrl}"`;
			});
		});
	}

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
};

export const config = {
	// Control which files Eleventy will process
	templateFormats: ["md", "njk"],

	// Content comes from Obsidian/Quartz and isn't written as an Eleventy
	// template, so don't pre-process markdown (code samples contain {{ }}
	// and {% %} which would otherwise be interpreted as template syntax).
	markdownTemplateEngine: false,

	// These are all optional:
	dir: {
		input: "content",          // default: "."
		includes: "../_includes",  // default: "_includes" (`input` relative)
		data: "../_data",          // default: "_data" (`input` relative)
		output: "_site"
	},

	// -----------------------------------------------------------------
	// Optional items:
	// -----------------------------------------------------------------

	// If your site deploys to a subdirectory, change `pathPrefix`.
	// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

	// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
	// it will transform any absolute URLs in your HTML to include this
	// folder name and does **not** affect where things go in the output folder.

	// pathPrefix: "/",
};
