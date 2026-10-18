import path from "node:path";
import { fileURLToPath } from "node:url";

const contentRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../content");

export function contentRootDir() {
	return contentRoot;
}

// Quartz-compatible path slugging (mirrors @quartz-community/utils slugifyPath)
// so URLs stay identical to the old site.
export function slugifyPath(p) {
	return String(p)
		.split("/")
		.map((segment) =>
			segment
				.replace(/\s/g, "-")
				.replace(/&/g, "-and-")
				.replace(/%/g, "-percent")
				.replace(/\?/g, "")
				.replace(/#/g, "")
				.toLowerCase(),
		)
		.join("/");
}

export function stripSlashes(p) {
	return String(p).replace(/^\/+/, "").replace(/\/+$/, "");
}

// "CTFs/CTFs.md" -> "ctfs/index", "Blogs/My Post.md" -> "blogs/my-post"
export function slugifyFilePath(fp) {
	fp = stripSlashes(String(fp).split(path.sep).join("/"));
	const withoutExt = fp.replace(/\.(md|html)$/i, "");
	let slug = slugifyPath(withoutExt);
	if (slug.endsWith("_index")) {
		slug = slug.replace(/_index$/, "index");
	}
	const segments = slug.split("/");
	if (segments.length >= 2 && segments[segments.length - 1] === segments[segments.length - 2]) {
		segments[segments.length - 1] = "index";
		slug = segments.join("/");
	}
	return slug;
}

// "ctfs/index" -> "ctfs", "index" -> "" (site root)
export function simplifySlug(fp) {
	const segments = String(fp)
		.replace(/\/+$/, "")
		.split("/");
	if (segments[segments.length - 1] === "index") {
		segments.pop();
	}
	return segments.join("/");
}

// Trailing-slash permalink for a content file: "/blogs/my-post/" or "/"
export function permalinkFor(inputPath) {
	const rel = path.relative(contentRoot, inputPath).split(path.sep).join("/");
	const slug = simplifySlug(slugifyFilePath(rel));
	return slug === "" ? "/" : `/${slug}/`;
}
