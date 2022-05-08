import { Data, getPostDetails, getPostsJson } from "./Drays";
import inquirer from "inquirer";
const main = async () => {
	const posts_json = await getPostsJson("uncharted");
	if (posts_json.length > 0) {
		const post_json = posts_json[0];
		const post_link = post_json.link;

		const dlLinks: Data[] = await getPostDetails(post_link);

		inquirer
			.prompt([
				{
					type: "list",
					name: "dlLink",
					message: "Select a download link",
					choices: dlLinks.map((dlLink) => {
						return {
							name: `${dlLink.dlLink.server} - ${dlLink.dlLink.link} - ${dlLink.type} - ${dlLink.subType}`,
							value: dlLink,
						};
					}),
				},
			])
			.then((answers) => {
				const dlLink = answers.dlLink;
				console.log(dlLink);
			});
	}
};

main();
