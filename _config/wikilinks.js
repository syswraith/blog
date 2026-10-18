import fs from "node:fs";
import path from "node:path";
import { contentRootDir, simplifySlug, slugifyFilePath, stripSlashes } from "./slugs.js";

function walk(dir, base, out) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (entry.name.startsWith(".")) continue;
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walk(full, base, out);
		} else if (entry.name.endsWith(".md")) {
			out.push(path.relative(base, full).split(path.sep).join("/"));
		}
	}
	return out;
}

function splitAnchor(target) {
	const idx = target.indexOf("#");
	if(idx === -1) {
		return [target, ""];
	}
	return [target.slice(0, idx), target.slice(idx + 1)];
}

const CACHE_TTL = 1000;

export default function wikilinkPlugin(md, opts = {}) {
	const slugify = opts.slugify || ((s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
	let pagesCache;
	let cacheTime = 0;

	function getPages() {
		const now = Date.now();
		if (!pagesCache || now - cacheTime > CACHE_TTL) {
			const root = contentRootDir();
			pagesCache = [];
			if (fs.existsSync(root)) {
				for (const rel of walk(root, root, [])) {
					pagesCache.push({ rel, slug: simplifySlug(slugifyFilePath(rel)) });
				}
			}
			cacheTime = now;
		}
		return pagesCache;
	}

	// resolve [[target#anchor|label]] to an href (or undefined when unmatched)
	function resolve(raw) {
		let target = raw;
		try {
			target = decodeURI(raw);
		} catch {
			// keep raw on malformed URI sequences
		}

		const [pathPart, anchorPart] = splitAnchor(target.trim());
		const anchor = anchorPart ? `#${slugify(anchorPart)}` : "";
		const isFolder = pathPart.trim().endsWith("/");
		const bare = stripSlashes(pathPart.trim());

		if (!bare) {
			return anchor || undefined;
		}

		const pages = getPages();

		if (isFolder) {
			const slug = stripSlashes(simplifySlug(slugifyFilePath(bare)));
			const exists = pages.some((p) => p.slug === slug || p.slug.startsWith(slug + "/"));
			if (exists) {
				return `/${slug}/${anchor}`;
			}
			return undefined;
		}

		const slugged = slugifyFilePath(bare);
		const matches = pages
			.filter((p) => p.slug === slugged || p.slug.endsWith("/" + slugged))
			.sort((a, b) => a.slug.length - b.slug.length);

		if (matches.length > 0) {
			const slug = matches[0].slug;
			return `/${slug}/${anchor}`;
		}

		return undefined;
	}

	function labelFor(raw) {
		const target = raw.trim();
		const [beforeAlias] = target.split("|");
		const [pathPart] = splitAnchor(beforeAlias);
		const bare = stripSlashes(pathPart.trim());
		const segment = bare.split("/").pop() || bare;
		return segment.replace(/\.md$/i, "");
	}

	md.inline.ruler.before("emphasis", "wikilink", (state, silent) => {
		const start = state.pos;
		if (state.src.charCodeAt(start) !== 0x5b || state.src.charCodeAt(start + 1) !== 0x5b) {
			return false;
		}
		const end = state.src.indexOf("]]", start + 2);
		if (end < 0) {
			return false;
		}
		const inner = state.src.slice(start + 2, end);
		if (!inner || inner.includes("[[")) {
			return false;
		}

		// alias: [[target|label]]
		const pipe = inner.indexOf("|");
		const target = pipe === -1 ? inner : inner.slice(0, pipe);
		const label = pipe === -1 ? labelFor(inner) : inner.slice(pipe + 1);
		const href = resolve(target);

		if (!silent) {
			if (href) {
				const open = state.push("link_open", "a", 1);
				open.attrs = [["href", href], ["class", "wikilink"]];
				const text = state.push("text", "", 0);
				text.content = label;
				state.push("link_close", "a", -1);
			} else {
				const missing = state.push("wikilink_missing", "", 0);
				missing.content = label;
			}
		}

		state.pos = end + 2;
		return true;
	});

	md.renderer.rules.wikilink_missing = (tokens, idx) =>
		`<span class="wikilink-missing">${md.utils.escapeHtml(tokens[idx].content)}</span>`;
}
