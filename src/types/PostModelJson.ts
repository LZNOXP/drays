interface Guid {
	rendered: string;
}

interface Title {
	rendered: string;
}

interface Content {
	rendered: string;
	protected: boolean;
}

interface Excerpt {
	rendered: string;
	protected: boolean;
}

interface Self {
	href: string;
}

interface Collection {
	href: string;
}

interface About {
	href: string;
}

interface Author2 {
	embeddable: boolean;
	href: string;
}

interface Reply {
	embeddable: boolean;
	href: string;
}

interface VersionHistory {
	count: number;
	href: string;
}

interface PredecessorVersion {
	id: number;
	href: string;
}

interface WpFeaturedmedia {
	embeddable: boolean;
	href: string;
}

interface WpAttachment {
	href: string;
}

interface WpTerm {
	taxonomy: string;
	embeddable: boolean;
	href: string;
}

interface Cury {
	name: string;
	href: string;
	templated: boolean;
}

export interface PostModelJson {
	id: number;
	date: Date;
	date_gmt: Date;
	modified: Date;
	modified_gmt: Date;
	slug: string;
	status: string;
	type: string;
	link: string;
	title: Title;
	content: Content;
	excerpt: Excerpt;
	author: number;
	featured_media: number;
	comment_status: string;
	ping_status: string;
	sticky: boolean;
	template: string;
	format: string;
	meta: any[];
	categories: number[];
	tags: any[];
}
