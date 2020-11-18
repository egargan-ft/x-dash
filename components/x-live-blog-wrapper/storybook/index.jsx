import React from 'react'
import { LiveBlogWrapper } from '../src/LiveBlogWrapper'
import '../../x-live-blog-post/dist/LiveBlogPost.css'

const defaultProps = {
	message: 'Test',
	posts: [
		{
			id: 12345,
			title: 'Title 1',
			bodyHTML: '<p>Post 1</p>',
			isBreakingNews: false,
			publishedDate: '2020-05-13T18:52:28.000Z',
			articleUrl: 'https://www.ft.com/content/2b665ec7-a88f-3998-8f39-5371f9c791ed',
			showShareButtons: true
		},
		{
			id: 12346,
			title: 'Title 2',
			bodyHTML: '<p>Post 2</p>',
			isBreakingNews: true,
			publishedDate: '2020-05-13T19:52:28.000Z',
			articleUrl: 'https://www.ft.com/content/2b665ec7-a88f-3998-8f39-5371f9c791ed',
			showShareButtons: true
		},
		{
			id: 12347,
			title: 'Title 3',
			bodyHTML: '<p>Post 3</p>',
			isBreakingNews: false,
			publishedDate: '2020-05-13T20:52:28.000Z',
			articleUrl: 'https://www.ft.com/content/2b665ec7-a88f-3998-8f39-5371f9c791ed',
			showShareButtons: true
		}
	]
}

export default {
	title: 'x-live-blog-wrapper',
	parameters: {
		escapeHTML: false
	}
}

export const ContentBody = (args) => {
	return <LiveBlogWrapper {...args} />
}

ContentBody.args = defaultProps
