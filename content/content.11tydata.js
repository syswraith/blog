import { permalinkFor } from "../_config/slugs.js";

export default {
	layout: "layouts/home.njk",
	eleventyComputed: {
		// Quartz-style slugged URLs, e.g. /blogs/inside-the-chip-8-virtual-machine/
		// Files named after their folder become the folder index: CTFs/CTFs.md -> /ctfs/
		permalink(data) {
			// Eleventy pre-populates `permalink` as an empty string.
			if(typeof data.permalink === "string" && data.permalink.trim() !== "") {
				return data.permalink;
			}
			if(!data.page?.inputPath?.endsWith(".md")) {
				return undefined;
			}
			return permalinkFor(data.page.inputPath);
		}
	}
};
