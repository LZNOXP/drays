import { Data, getPostDetails, getPostsJson } from "./Drays";
import inquirer from "inquirer";
import { PostModelJson } from "./types/PostModelJson";
import ora from "ora";
import open from "open";

const main = async () => {
	var posts_json: PostModelJson[] = [];
	var posts_details: Data[] = [];
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
		message: "Select a download link :",
		choices: () =>
			posts_details.map((download: Data) => {
				return {
					name: `${download.subType} - ${download.server} | ${download.type}`,
					value: download,
				};
			}),
	};

	inquirer.prompt([searchQuestion]).then((answers: any) => {
		inquirer.prompt(postQuestion).then(async ({ post }) => {
			const spinner = ora("Getting Download Link...").start();
			posts_details = await getPostDetails(post.link);
			spinner.stop();

			inquirer.prompt(downloadQuestion).then((ans) => {
				const link = ans.download.link;
				console.log("Opening link : " + link);
				open(link);
			});
		});
	});
};

main();
