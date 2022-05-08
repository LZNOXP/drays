import fetch from "node-fetch-commonjs";
import * as cheerion from "cheerio";
import { PostModelJson } from "./types/PostModelJson";

const base_url = "https://167.86.71.48/";
const wp_url = base_url + "wp-json/wp/v2/";
const posts_ep = wp_url + "posts";
export interface Data {
	type: string;
	subType: string;
	dlLink: {
		server: string;
		link: string;
	};
}
const loadCheerio = async (url: string) => {
	try {
		const response = await fetch(url);
		if (response.status === 200) {
			const html = await response.text();
			const $ = cheerion.load(html);
			return $;
		}
		throw new Error("Failed to load page : error -> " + response.status);
	} catch (error) {
		throw error;
	}
};

const extractSeriesData = async (
	elem: cheerion.Cheerio<cheerion.Element>,
	$: cheerion.CheerioAPI,
	onExtract: (download: Data) => void
) => {
	const extractTds = (
		tds: cheerion.Cheerio<cheerion.Element>,
		type: string,
		onExtract: (download: Data) => void
	) => {
		var tdFirst = true;
		var tdType = "";
		tds.each((i, td) => {
			if (tdFirst) {
				tdType = $(td).text();
				tdFirst = false;
			} else {
				const as = $(td).find("a");
				as.each((i, a) => {
					const aLink = $(a).attr("href") ?? "";
					const aServer = $(a).text() ?? "";
					const data: Data = {
						type: type,
						subType: tdType,
						dlLink: {
							server: aServer,
							link: aLink,
						},
					};
					onExtract(data);
				});
			}
		});
	};

	var trFirst = true;
	var trType = "";
	elem.each((i, tr) => {
		if (trFirst) {
			trType = $(tr).text();
			trFirst = false;
		} else {
			const tds = $(tr).find("td");
			extractTds(tds, trType, onExtract);
		}
	});
};
const extractMovieData = async (
	elem: cheerion.Cheerio<cheerion.Element>,
	$: cheerion.CheerioAPI,
	onExtract: (download: Data) => void
) => {
	const details: Data[] = [];
	var first = true;
	var type = "";
	elem.each((i, div) => {
		if (first) {
			first = false;
			type = $(div).text();
		} else {
			const subType = $(div).children().first().text();
			const divs = $(div).children().last();
			const as = divs.find("a");
			as.each((i, a) => {
				const link = $(a).attr("href") ?? "";
				const server = $(a).text() ?? "";
				// console.log(`${type} -> ${subType} -> ${server} -> ${link}`);
				onExtract({
					type,
					subType,
					dlLink: {
						link,
						server,
					},
				});
			});
		}
	});
	return details;
};

export const getPostsJson = async (searchQuery: string) => {
	const posts = await fetch(posts_ep + "?search=" + searchQuery);
	const posts_json = (await posts.json()) as PostModelJson[];
	return posts_json;
};
export const getPostDetails = async (post_link: string) => {
	const details: Data[] = [];
	const $ = await loadCheerio(post_link);

	const runTimeElem = $("div.mr-4:nth-child(3)");
	const isSeries = runTimeElem.text().includes("Eps");
	if (isSeries) {
		const tBodys = $("#main-content > div.text-sm.my-4.mb-4 > table > tbody");
		tBodys.each((i, tbody) => {
			const trs = $(tbody).find("tr");
			extractSeriesData(trs, $, (data: Data) => {
				details.push(data);
			});
		});
	} else {
		const divs = $("#dl_tab");
		divs.each((i, div) => {
			const children = $(div).children();
			extractMovieData(children, $, (data: Data) => {
				details.push(data);
			});
		});
	}
	return details;
};
