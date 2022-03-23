import React from 'react'
import BuildService from '../../../.storybook/build-service'
import { PrivacyManager } from '../src/privacy-manager'

const dependencies = {
	'o-loading': '^4.0.0',
	'o-message': '^4.0.0',
	'o-typography': '^6.0.0'
}

/**
 * @param {import("../typings/x-privacy-manager").PrivacyManagerProps} args
 */
export function StoryContainer(args) {
	return (
		<div className="story-container">
			{dependencies && <BuildService dependencies={dependencies} />}
			<div style={{ maxWidth: 740, margin: 'auto' }}>
				<PrivacyManager {...args} />
			</div>
		</div>
	)
}
