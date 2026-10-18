import { DateTime } from "luxon";

import { slugifyPath } from "./slugs.js";

export default function(eleventyConfig) {
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat('yyyy-LL-dd');
	});

	eleventyConfig.addFilter("getKeys", target => Object.keys(target));

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "posts", "aliasRedirects", "eleventyNavigation"].indexOf(tag) === -1);
	});

	eleventyConfig.addFilter("sortAlphabetically", strings =>
		(strings || []).sort((b, a) => b.localeCompare(a))
	);

	// Quartz-compatible tag slug, e.g. "crackmes.one" -> "crackmes.one"
	eleventyConfig.addFilter("tagSlug", tag => slugifyPath(String(tag)));

	// Items from a content section, e.g. collections.all | section("Blogs", "date")
	eleventyConfig.addFilter("section", function section(items, dir, sortBy = "title") {
		const needle = `/content/${dir}/`;
		const out = (items || []).filter(item => {
			let inputPath = (item.inputPath || "").split("\\").join("/");
			return inputPath.includes(needle) && inputPath.endsWith(".md");
		});
		if(sortBy === "date") {
			out.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
		} else {
			out.sort((a, b) => (a.data.title || "").localeCompare(b.data.title || ""));
		}
		return out;
	});
};
