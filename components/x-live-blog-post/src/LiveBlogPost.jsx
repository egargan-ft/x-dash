/* eslint-disable jsx-a11y/no-static-element-interactions */
import { h } from '@financial-times/x-engine'
import ShareButtons from './ShareButtons'
import Timestamp from './Timestamp'
import styles from './LiveBlogPost.scss'

const LiveBlogPost = (props) => {
	const {
		id,
		postId, // Remove once wordpress is no longer in use
		title,
		content, // Remove once wordpress is no longer in use
		bodyHTML,
		publishedTimestamp, // Remove once wordpress is no longer in use
		publishedDate,
		isBreakingNews, // Remove once wordpress is no longer in use
		standout = {},
		articleUrl,
		showShareButtons = false,
		byline,
		ad,
		backToTopFunction,
		backToTopRef
	} = props

	const showBreakingNewsLabel = standout.breakingNews || isBreakingNews

	let backToTopProps = {}

	if (backToTopRef) {
		const processTopRef = (ref) => {
			return typeof ref === 'string' && ref.includes('#') ? ref : `#${ref}`
		}
		backToTopProps = {
			...backToTopProps,
			href: processTopRef(backToTopRef)
		}
	}

	if (backToTopFunction) {
		backToTopProps = {
			...backToTopProps,
			onClick: backToTopFunction
		}
	}

	return (
		<article
			className={`live-blog-post ${styles['live-blog-post']}`}
			data-trackable="live-post"
			id={`post-${id || postId}`}
			data-x-component="live-blog-post"
		>
			<div className="live-blog-post__meta">
				<Timestamp publishedTimestamp={publishedDate || publishedTimestamp} />
			</div>
			{showBreakingNewsLabel && <div className={styles['live-blog-post__breaking-news']}>Breaking news</div>}
			{title && <h2 className={styles['live-blog-post__title']}>{title}</h2>}
			{byline && <p className={styles['live-blog-post__byline']}>{byline}</p>}
			<div
				className={`${styles['live-blog-post__body']} n-content-body article--body`}
				dangerouslySetInnerHTML={{ __html: bodyHTML || content }}
			/>
			<div className={styles['live-blog-post__controls']}>
				{showShareButtons && <ShareButtons postId={id || postId} articleUrl={articleUrl} title={title} />}
				{(Boolean(backToTopFunction) || Boolean(backToTopRef)) && (
					// eslint-disable-next-line jsx-a11y/click-events-have-key-events
					<a
						{...backToTopProps}
						aria-labelledby="Back to top"
						className={styles['live-blog-post-controls__back-to-top']}
					>
						Back to top
					</a>
				)}
			</div>

			{ad}
		</article>
	)
}

export { LiveBlogPost }
