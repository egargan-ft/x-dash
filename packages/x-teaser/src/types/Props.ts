/** Strings must be a parseable format, e.g. ISO 8601 */
export type ContentType = 'article' | 'video' | 'podcast' | 'package' | 'liveblog' | 'promoted-content' | 'paid-post';

export type DateLike = Date | string | number;

export type LayoutVariant = 'small' | 'large' | 'hero' | 'top-story';

export type ModifierVariant = 'centre' | 'stretched' | 'opinion-background' | string;

export type ImageSize = 'XS' | 'Small' | 'Medium' | 'Large' | 'XL';

export interface Concept {
	id: string;
	url: string;
	prefLabel: string;
}

export interface Meta {
	showMeta: boolean;
	/** Usually a brand, or a genre, or content type */
	conceptPrefix?: string;
	concept?: Concept;
	conceptSuffix?: string;
	/** Fallback used if the contextID is the same as the display concept */
	alternativeConcept?: Concept;
	useAlternativeConcept: boolean;
	/** Promoted content type */
	promotedPrefix?: 'Paid Post' | 'Promoted content';
	promotedBy?: string;
}

export interface Title {
	showTitle: boolean;
	title: string;
	/** Used for testing headline variations */
	alternativeTitle?: string;
	useAlternativeTitle: boolean;
}

export interface Standfirst {
	showStandfirst: boolean;
	standfirst?: string;
	/** Used for testing standfirst variations */
	alternativeStandfirst?: string;
	useAlternativeStandfirst: boolean;
}

export interface Status {
	showStatus: boolean;
	publishedDate: DateLike;
	firstPublishedDate: DateLike;
	useRelativeTime: boolean;
	/** Live blog status, will override date and time */
	status?: 'inprogress' | 'comingsoon' | 'closed';
}

export interface Headshot {
	showHeadshot: boolean;
	/** Full headshot image URL */
	headshot?: string;
}

export interface Image {
	showImage: boolean;
	/** Images must be accessible to the Origami Image Service */
	image?: {
		url: string;
		width: number;
		height: number;
	};
	imageSize?: ImageSize;
}

export interface Related {
	showRelated: boolean;
	related?: Array<{ id: string; url: string; type: ContentType; title: string }>;
}

export interface Indicators {
	canBeDistributed: 'yes' | 'no' | 'verify';
	canBeSyndicated: 'yes' | 'no' | 'verify';
	accessLevel: 'premium' | 'subscribed' | 'registered' | 'free';
	/** Dynamically inferred options */
	isOpinion: boolean;
	isColumn: boolean;
	/** Methode packaging options */
	isEditorsChoice: boolean;
	isExclusive: boolean;
	isScoop: boolean;
	/** Package theme */
	theme: string;
}

export interface Variants {
	/** Default is "small" */
	layout?: LayoutVariant;
	/** Extra class name variations to append */
	modifiers?: ModifierVariant[];
}

export interface TeaserProps extends Meta, Title, Standfirst, Status, Headshot, Image, Related, Variants {
	id: string;
	url: string;
	type: ContentType;
	indicators: Indicators
}
