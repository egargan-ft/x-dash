import { h } from '@financial-times/x-engine'
import Title from './Title'
import RadioButtonsSection from './RadioButtonsSection'
import UrlSection from './UrlSection'
import MobileShareButtons from './MobileShareButtons'
import CopyConfirmation from './CopyConfirmation'
import styles from './GiftArticle.scss'

export default (props) => (
	<div className={styles.container}>
		<form name="gift-form" className={styles['share-form']}>
			<div role="group" arialabelledby="gift-article-title">
				<Title {...props} />

				{!props.isFreeArticle && (
					<RadioButtonsSection
						shareType={props.shareType}
						isArticleSharingUxUpdates={props.isArticleSharingUxUpdates}
						showGiftUrlSection={props.actions.showGiftUrlSection}
						showEnterpriseUrlSection={props.actions.showEnterpriseUrlSection}
						showNonGiftUrlSection={props.actions.showNonGiftUrlSection}
						enterpriseLimit={props.enterpriseLimit}
					/>
				)}

				<UrlSection {...props} />
			</div>
		</form>

		{props.showCopyConfirmation && (
			<CopyConfirmation
				hideCopyConfirmation={props.actions.hideCopyConfirmation}
				isArticleSharingUxUpdates={props.isArticleSharingUxUpdates}
			/>
		)}

		{props.showMobileShareLinks && <MobileShareButtons mobileShareLinks={props.mobileShareLinks} />}
	</div>
)
