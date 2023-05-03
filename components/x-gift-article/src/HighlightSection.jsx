import { h } from '@financial-times/x-engine'
import { ShareType } from './lib/constants'

export default ({ shareType, hasHighlights, includeHighlights, highlightsIncluded, isGiftUrlCreated }) => {
	if (shareType === ShareType.enterprise && hasHighlights) {
		if (isGiftUrlCreated && highlightsIncluded) {
			return (
				<div className="x-gift-article__checkbox">
					<div className="x-gift-article__highlight-shared">highlights VISIBLE TO RECIPIENTS</div>
				</div>
			)
		}
		return (
			<div className="o-forms-input o-forms-input--checkbox  o-forms-field x-gift-article__checkbox">
				<label htmlFor="includeHighlights">
					<input
						type="checkbox"
						id="includeHighlights"
						name="includeHighlights"
						value="includeHighlights"
						checked={highlightsIncluded}
						onChange={includeHighlights}
						disabled={isGiftUrlCreated}
					/>
					<span className="o-forms-input__label x-gift-article__checkbox-span">
						Make Highlight visible to the recipients
					</span>
				</label>
			</div>
		)
	}

	return null
}
