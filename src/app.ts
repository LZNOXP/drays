import { Data, getPostDetails, getPostsJson } from "./Drays";
import inquirer from "inquirer";
import { PostModelJson } from "./types/PostModelJson";
import ora from "ora";
import open from "open";

const main = async () => {
	var posts_json: PostModelJson[] = [];

	inquirer
		.prompt([
			{
				type: "input",
				name: "search",
				message: "Search for movies :",
				validatingText: "Searching...",
				validate: async (value: string) => {
					if (value.length <= 0) throw Error("Please enter a search term");
					posts_json = await getPostsJson(value);
					if (posts_json.length <= 0) throw Error("No results found");
					return true;
				},
			},
		])
		.then((answers: any) => {
			inquirer
				.prompt({
					type: "list",
					name: "post",
					loop: false,
					message: "Select a movie :",
					choices: posts_json.map((post: PostModelJson) => {
						return {
							name: `${post.title.rendered}`,
							value: post,
						};
					}),
				})
				.then(async ({ post }: { post: PostModelJson }) => {
					const spinner = ora("Getting Download Link...").start();
					const post_details = await getPostDetails(post.link);
					console.log(post_details[0]);

					spinner.stop();
					inquirer
						.prompt({
							type: "list",
							name: "download",
							loop: false,
							message: "Select a download link :",
							choices: post_details.map((download: Data) => {
								return {
									name: `${download.subType} - ${download.dlLink.server} | ${download.type}`,
									value: download,
								};
							}),
						})
						.then((ans) => {
							const link = ans.download.dlLink.link;
							console.log("Opening link : " + link);
							open(link);
						});
				});
		});
};

main();
