import { Data, getPostDetails, getPostsJson } from "./Drays";
import inquirer from "inquirer";
import { PostModelJson } from "./types/PostModelJson";

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
					const post_details = await getPostDetails(post.link);
					console.log("done");
				});
		});
};

main();
