import { AdvancedSharing } from '../src/AdvancedSharing'
import fetchMock from 'fetch-mock'
import React from 'react'
import { Helmet } from 'react-helmet'
import BuildService from '../../../.storybook/build-service'

const dependencies = {
	'o-fonts': '^3.0.0'
}

export default {
	title: 'x-advanced-sharing'
}

export const WithGiftCredits = (args) => {
	require('./with-gift-credits').fetchMock(fetchMock)
	return (
		<div className="story-container">
			{dependencies && <BuildService dependencies={dependencies} />}
			<Helmet>
				<link rel="stylesheet" href={`components/x-advanced-sharing/dist/GiftArticle.css`} />
			</Helmet>
			<AdvancedSharing {...args} />
		</div>
	)
}
WithGiftCredits.storyName = 'With gift credits'
WithGiftCredits.args = require('./with-gift-credits').args

export const WithoutGiftCredits = (args) => {
	require('./without-gift-credits').fetchMock(fetchMock)
	return (
		<div className="story-container">
			{dependencies && <BuildService dependencies={dependencies} />}
			<Helmet>
				<link rel="stylesheet" href={`components/x-advanced-sharing/dist/GiftArticle.css`} />
			</Helmet>
			<AdvancedSharing {...args} />
		</div>
	)
}

WithoutGiftCredits.storyName = 'Without gift credits'
WithoutGiftCredits.args = require('./without-gift-credits').args

export const WithGiftLink = (args) => {
	require('./with-gift-link').fetchMock(fetchMock)
	return (
		<div className="story-container">
			{dependencies && <BuildService dependencies={dependencies} />}
			<Helmet>
				<link rel="stylesheet" href={`components/x-advanced-sharing/dist/GiftArticle.css`} />
			</Helmet>
			<AdvancedSharing {...args} />
		</div>
	)
}

WithGiftLink.storyName = 'With gift link'
WithGiftLink.args = require('./with-gift-link').args

export const FreeArticle = (args) => {
	require('./free-article').fetchMock(fetchMock)
	return (
		<div className="story-container">
			{dependencies && <BuildService dependencies={dependencies} />}
			<Helmet>
				<link rel="stylesheet" href={`components/x-advanced-sharing/dist/GiftArticle.css`} />
			</Helmet>
			<AdvancedSharing {...args} />
		</div>
	)
}

FreeArticle.storyName = 'Free article'
FreeArticle.args = require('./free-article').args

export const NativeShare = (args) => {
	require('./native-share').fetchMock(fetchMock)
	return (
		<div className="story-container">
			{dependencies && <BuildService dependencies={dependencies} />}
			<Helmet>
				<link rel="stylesheet" href={`components/x-advanced-sharing/dist/GiftArticle.css`} />
			</Helmet>
			<AdvancedSharing {...args} />
		</div>
	)
}

NativeShare.storyName = 'Native share'
NativeShare.args = require('./native-share').args

export const ErrorResponse = (args) => {
	require('./error-response').fetchMock(fetchMock)
	return (
		<div className="story-container">
			{dependencies && <BuildService dependencies={dependencies} />}
			<Helmet>
				<link rel="stylesheet" href={`components/x-advanced-sharing/dist/GiftArticle.css`} />
			</Helmet>
			<AdvancedSharing {...args} />
		</div>
	)
}

ErrorResponse.storyName = 'Error response'
ErrorResponse.args = require('./error-response').args