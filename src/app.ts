import { Data, getPostDetails, getPostsJson } from "./Drays";
import inquirer from "inquirer";
import { PostModelJson } from "./types/PostModelJson";
import ora from "ora";
import open from "open";

interface DataGroup {
	[key: string]: Data[];
}

const main = async () => {
	var posts_json: PostModelJson[] = [];
	var posts_details: Data[] = [];
	var posts_details_subtype: DataGroup = {};
	const searchQuestion: inquirer.Question = {
		type: "input",
		name: "search",
		message: "Search for movies : ",
		validatingText: "Searching...",
		validate: async (input: string) => {
			if (input.length <= 0) throw Error("Please enter a search term");
			posts_json = await getPostsJson(input);
			if (posts_json.length <= 0) throw Error("No results found");
			return true;
		},
	};

	const postQuestion: inquirer.QuestionCollection = {
		type: "list",
		name: "post",
		loop: false,
		message: "Select a movie :",
		choices: () =>
			posts_json.map((post: PostModelJson) => {
				return {
					name: `${post.title.rendered}`,
					value: post,
				};
			}),
	};

	const downloadQuestion: inquirer.QuestionCollection = {
		type: "list",
		name: "download",
		loop: false,
		message: "Selech which to download :",
		choices: () =>
			Object.keys(posts_details_subtype).map((key: string) => {
				return { name: key, value: posts_details_subtype[key] };
			}),
		// posts_details.map((download: Data) => {
		// 	return {
		// 		name: `${download.subType} - ${download.server} | ${download.type}`,
		// 		value: download,
		// 	};
		// }),
	};

	inquirer.prompt([searchQuestion]).then((answers: any) => {
		inquirer.prompt(postQuestion).then(async ({ post }) => {
			const spinner = ora("Getting Download Link...").start();
			posts_details = await getPostDetails(post.link);
			posts_details_subtype = posts_details.reduce(
				(acc: DataGroup, curr: Data) => {
					acc[curr.subType] = acc[curr.subType] || [];
					acc[curr.subType].push(curr);
					return acc;
				},
				{}
			);
			spinner.stop();
			inquirer.prompt(downloadQuestion).then((ans) => {
				inquirer
					.prompt([
						{
							type: "list",
							loop: "false",
							name: "open",
							message: "Select a download link :",
							choices: (_) => {
								return ans.download.map((download: Data) => {
									return {
										name: `${download.subType} - ${download.server} | ${download.type}`,
										value: download,
									};
								});
							},
						},
					])
					.then((answers: any) => {
						open(answers.open.link);
					});

				// const link = ans.download.link;
				// console.log("Opening link : " + link);
				// open(link);
			});
		});
	});
};

main();
