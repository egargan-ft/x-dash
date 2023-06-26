import { h } from '@financial-times/x-engine'
import { withActions } from '@financial-times/x-interaction'

import Loading from './Loading'

import ApiClient from './lib/api'
import EnterpriseApiClient from './lib/enterpriseApi'
import { copyToClipboard, createMailtoUrl } from './lib/share-link-actions'
import tracking from './lib/tracking'
import * as updaters from './lib/updaters'
import { ShareType } from './lib/constants'
import ShareArticleDialog from './v2/ShareArticleDialog'
import Form from './Form'
import oShare from '@financial-times/o-share/main'

const isCopySupported =
	typeof document !== 'undefined' && document.queryCommandSupported && document.queryCommandSupported('copy')

const withGiftFormActions = withActions(
	(initialProps) => {
		const api = new ApiClient({
			protocol: initialProps.apiProtocol,
			domain: initialProps.apiDomain
		})
		const enterpriseApi = new EnterpriseApiClient(initialProps.enterpriseApiBaseUrl)

		return {
			showGiftUrlSection() {
				return updaters.showGiftUrlSection
			},

			showEnterpriseUrlSection() {
				return updaters.showGiftEnterpriseSection
			},

			showNonGiftUrlSection() {
				return updaters.showNonGiftUrlSection
			},

			showAdvancedSharingOptions() {
				return updaters.showAdvancedSharingOptions
			},

			hideAdvancedSharingOptions() {
				return updaters.hideAdvancedSharingOptions
			},

			async createGiftUrl() {
				const { redemptionUrl, redemptionLimit } = await api.getGiftUrl(initialProps.article.id)

				if (redemptionUrl) {
					const { url, isShortened } = await api.getShorterUrl(redemptionUrl)
					tracking.createGiftLink(url, redemptionUrl)

					return updaters.setGiftUrl(url, redemptionLimit, isShortened)
				} else {
					return updaters.setErrorState(true)
				}
			},

			async shortenNonGiftUrl() {
				return async (state) => {
					const { url, isShortened } = await api.getShorterUrl(state.urls.nonGift)
					tracking.createNonGiftLink(url, state.urls.nonGift)

					if (isShortened) {
						return updaters.setShortenedNonGiftUrl(url)(state)
					} else {
						return updaters.setErrorState(true)
					}
				}
			},

			async createEnterpriseUrl() {
				return async (state) => {
					const { redemptionUrl, redemptionLimit } = await enterpriseApi.getESUrl(
						initialProps.article.id,
						state.includeHighlights
					)

					if (redemptionUrl) {
						tracking.createESLink(redemptionUrl)
						return updaters.setGiftUrl(redemptionUrl, redemptionLimit, false, true)(state)
					} else {
						return updaters.setErrorState(true)
					}
				}
			},

			copyGiftUrl(event) {
				copyToClipboard(event)

				return (state) => {
					const giftUrl = state.urls.gift
					tracking.copyLink('giftLink', giftUrl)

					return { showCopyConfirmation: true }
				}
			},

			copyEnterpriseUrl(event) {
				copyToClipboard(event)

				return (state) => {
					const enterpriseUrl = state.urls.enterprise
					tracking.copyLink('enterpriseLink', enterpriseUrl)

					return { showCopyConfirmation: true }
				}
			},

			copyNonGiftUrl(event) {
				copyToClipboard(event)

				return (state) => {
					const nonGiftUrl = state.urls.nonGift
					tracking.copyLink('nonGiftLink', nonGiftUrl)

					return { showCopyConfirmation: true }
				}
			},

			emailGiftUrl() {
				return (state) => {
					tracking.emailLink('giftLink', state.urls.gift)
				}
			},

			emailEnterpriseUrl() {
				return (state) => {
					tracking.emailLink('enterpriseLink', state.urls.enterprise)
				}
			},

			emailNonGiftUrl() {
				return (state) => {
					tracking.emailLink('nonGiftLink', state.urls.nonGift)
				}
			},

			hideCopyConfirmation() {
				return { showCopyConfirmation: false }
			},

			shareByNativeShare() {
				throw new Error(`shareByNativeShare should be implemented by x-gift-article's consumers`)
			},

			activate() {
				return async (state) => {
					const { enabled, limit, hasCredits, firstTimeUser, requestAccess } =
						await enterpriseApi.getEnterpriseArticleAllowance()

					const enterpriseState = {
						enterpriseLimit: limit,
						enterpriseHasCredits: hasCredits,
						enterpriseFirstTimeUser: firstTimeUser,
						enterpriseRequestAccess: requestAccess
					}

					if (enabled) {
						tracking.initEnterpriseSharing(
							requestAccess
								? 'enterprise-request-access'
								: !hasCredits
								? 'enterprise-no-credits'
								: 'enterprise-enabled'
						)
					} else {
						tracking.initEnterpriseSharing('enterprise-disabled')
					}

					if (initialProps.isFreeArticle) {
						const { url, isShortened } = await api.getShorterUrl(state.urls.nonGift)

						if (isShortened) {
							updaters.setShortenedNonGiftUrl(url)(state)
						}
						return {
							invalidResponseFromApi: true,
							enterpriseEnabled: enabled,
							...enterpriseState
						}
					} else {
						const { giftCredits, monthlyAllowance, nextRenewalDate } = await api.getGiftArticleAllowance()

						// avoid to use giftCredits >= 0 because it returns true when null and ""
						if (giftCredits > 0 || giftCredits === 0) {
							return {
								...updaters.setAllowance(giftCredits, monthlyAllowance, nextRenewalDate),
								shareType: ShareType.nonGift,
								enterpriseEnabled: enabled,
								...enterpriseState
							}
						} else {
							return {
								invalidResponseFromApi: true,
								enterpriseEnabled: enabled,
								...enterpriseState
							}
						}
					}
				}
			},
			setIncludeHighlights(includeHighlights) {
				return (state) => {
					state.includeHighlights = includeHighlights
					return { includeHighlights }
				}
			},
			checkIfHasHighlights() {
				return (state) => {
					state.hasHighlights = !!document.getElementsByClassName(state.highlightClassName).length
					return { hasHighlights: state.hasHighlights }
				}
			},
			saveHighlightsHandler() {
				return () => {
					return {
						showHighlightsRecipientMessage: false,
						showHighlightsSuccessMessage: true,
						showHighlightsCheckbox: true
					}
				}
			},
			closeHighlightsRecipientMessage() {
				return () => {
					return {
						showHighlightsRecipientMessage: false
					}
				}
			},
			closeHighlightsSuccessMessage() {
				return () => {
					return {
						showHighlightsSuccessMessage: false
					}
				}
			},
			initOShare(selector) {
				return () => {
					return new oShare(document.querySelector(selector))
				}
			}
		}
	},
	(props) => {
		const initialState = {
			title: 'Share this article:',
			giftCredits: undefined,
			monthlyAllowance: undefined,
			showCopyButton: isCopySupported,
			isGiftUrlCreated: false,
			isGiftUrlShortened: false,
			isNonGiftUrlShortened: false,
			includeHighlights: false,
			showAdvancedSharingOptions: false,
			hasHighlights: false,
			showHighlightsRecipientMessage: new URL(location.href).searchParams.has('highlights'),
			showHighlightsSuccessMessage: false,
			showHighlightsCheckbox: !new URL(location.href).searchParams.has('highlights'),
			highlightClassName: 'user-annotation',
			urls: {
				dummy: 'https://on.ft.com/gift_link',
				gift: undefined,
				enterprise: undefined,
				nonGift: `${props.article.url}?shareType=nongift`
			},

			mailtoUrls: {
				gift: undefined,
				enterprise: undefined,
				nonGift: createMailtoUrl(props.article.title, `${props.article.url}?shareType=nongift`)
			},

			mobileShareLinks: props.showMobileShareLinks
				? {
						facebook: `http://www.facebook.com/sharer.php?u=${encodeURIComponent(
							props.article.url
						)}&t=${encodeURIComponent(props.article.title)}`,
						twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
							props.article.url
						)}&text=${encodeURIComponent(props.article.title)}&via=financialtimes`,
						linkedin: `http://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
							props.article.url
						)}&title=${encodeURIComponent(props.article.title)}&source=Financial+Times`,
						whatsapp: `whatsapp://send?text=${encodeURIComponent(
							props.article.title
						)}%20-%20${encodeURIComponent(props.article.url)}`
				  }
				: undefined
		}

		const expandedProps = Object.assign({}, props, initialState)
		const sectionProps = props.isFreeArticle
			? updaters.showNonGiftUrlSection(expandedProps)
			: updaters.showGiftUrlSection(expandedProps)

		return Object.assign(initialState, sectionProps)
	}
)

const BaseGiftArticle = (props) => {
	return props.isLoading ? <Loading /> : <Form {...props} />
}

const BaseShareArticleModal = (props) => {
	return props.isLoading ? <Loading /> : <ShareArticleDialog {...props} />
}

const GiftArticle = withGiftFormActions(BaseGiftArticle)

const ShareArticleModal = withGiftFormActions(BaseShareArticleModal)

export { GiftArticle, ShareArticleModal }
