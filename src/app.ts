import { Data, getPostDetails, getPostsJson } from "./Drays";

const main = async () => {
	const posts_json = await getPostsJson("uncharted");
	if (posts_json.length > 0) {
		const post_json = posts_json[0];
		const post_link = post_json.link;

		const dlLinks: Data[] = await getPostDetails(post_link);
		console.log(dlLinks[0].dlLink);
	}
};

main();
