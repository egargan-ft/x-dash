import fetchMock from 'fetch-mock'
import { h } from '@financial-times/x-engine'
import { mount } from '@financial-times/x-test-utils/enzyme'
import { ShareArticleModal } from '../dist/GiftArticle.cjs'

jest.mock('@financial-times/o-share', () => jest.fn())

const articleId = 'article id'
const articleUrl = 'https://www.ft.com/content/blahblahblah'
const articleUrlRedeemed = 'https://gift-url-redeemed'
const nonGiftArticleUrl = `${articleUrl}?shareType=nongift`

const baseArgs = {
	title: 'Share this article:',
	isFreeArticle: false,
	article: {
		id: articleId,
		url: articleUrl,
		title: 'Equinor and Daimler Truck cut Russia ties as Volvo and JLR halt car deliveries'
	},
	showMobileShareLinks: true,
	id: 'base-gift-article-static-id',
	enterpriseApiBaseUrl: `https://enterprise-sharing-api.ft.com`
}

describe('x-gift-article', () => {
	let actions = {}

	beforeEach(() => {
		actions = {}

		fetchMock
			.get('path:/article/gift-credits', {
				allowance: 20,
				consumedCredits: 5,
				remainingCredits: 15,
				renewalDate: '2018-08-01T00:00:00Z'
			})
			.get(`path:/article/shorten-url/${encodeURIComponent(articleUrlRedeemed)}`, {
				shortenedUrl: 'https://shortened-gift-url'
			})
			.get(`path:/article/shorten-url/${encodeURIComponent(nonGiftArticleUrl)}`, {
				shortenedUrl: 'https://shortened-non-gift-url'
			})
			.get(`path:/article/gift-link/${encodeURIComponent(articleId)}`, {
				redemptionUrl: articleUrlRedeemed,
				redemptionLimit: 3,
				remainingAllowance: 1
			})
			.get('path:/v1/users/me/allowance', {
				limit: 120,
				hasCredits: true,
				firstTimeUser: false
			})
			.post('path:/v1/shares', {
				url: articleUrlRedeemed,
				redeemLimit: 120
			})
	})

	afterEach(() => {
		fetchMock.reset()
	})

	it('displays the article title', async () => {
		const args = {
			...baseArgs
		}

		args.article.title = 'A given test article title'

		const subject = mount(<ShareArticleModal {...args} />)

		expect(subject.find('h2').text()).toEqual('A given test article title')
	})

	it('should call correct endpoints on activate', async () => {
		mount(<ShareArticleModal {...baseArgs} actionsRef={(a) => Object.assign(actions, a)} />)

		await actions.activate()

		// it checks enterprise
		expect(fetchMock.called('https://enterprise-sharing-api.ft.com/v1/users/me/allowance')).toBe(true)
		// it checks gift-credits
		expect(fetchMock.called('/article/gift-credits')).toBe(true)
	})

	it('should call shortenNonGiftUrl and display correct url', async () => {
		const subject = mount(<ShareArticleModal {...baseArgs} actionsRef={(a) => Object.assign(actions, a)} />)

		await actions.showNonGiftUrlSection()
		await actions.shortenNonGiftUrl()

		subject.update()

		const input = subject.find('input#share-link')
		expect(input.prop('value')).toEqual('https://shortened-non-gift-url')
	})

	it('should call createGiftUrl and display correct url', async () => {
		const subject = mount(<ShareArticleModal {...baseArgs} actionsRef={(a) => Object.assign(actions, a)} />)

		await actions.createGiftUrl()

		subject.update()

		const input = subject.find('input#share-link')

		expect(input.prop('value')).toEqual('https://shortened-gift-url')
	})

	it('should call createEnterpriseUrl and display correct url', async () => {
		const subject = mount(<ShareArticleModal {...baseArgs} actionsRef={(a) => Object.assign(actions, a)} />)
		expect(actions.createEnterpriseUrl).toBeDefined()
		await actions.createEnterpriseUrl()

		subject.update()

		const input = subject.find('input#share-link')
		expect(input.prop('value')).toEqual('https://gift-url-redeemed')
	})

	it('when credits are available, an alert is not shown', async () => {
		const subject = mount(<ShareArticleModal {...baseArgs} actionsRef={(a) => Object.assign(actions, a)} />)

		await actions.activate()

		subject.update()

		expect(subject.find('#no-credit-alert')).not.toExist()
	})

	it('when no credits are available, an alert is shown', async () => {
		fetchMock
			.get(
				'path:/article/gift-credits',
				{
					allowance: 20,
					consumedCredits: 20,
					remainingCredits: 0,
					renewalDate: '2018-08-01T00:00:00Z'
				},
				{ overwriteRoutes: true }
			)
			.get(
				'path:/v1/users/me/allowance',
				{
					limit: 120,
					hasCredits: false,
					firstTimeUser: false
				},
				{ overwriteRoutes: true }
			)

		const subject = mount(<ShareArticleModal {...baseArgs} actionsRef={(a) => Object.assign(actions, a)} />)

		await actions.activate()

		subject.update()

		expect(subject.find('#no-credit-alert')).toExist()
	})

	it('displays the social share buttons when showMobileShareLinks is true', async () => {
		const subject = mount(<ShareArticleModal {...baseArgs} actionsRef={(a) => Object.assign(actions, a)} />)

		await actions.activate()

		await actions.shortenNonGiftUrl()

		subject.update()

		expect(subject.find('#social-share-buttons')).toExist()
	})

	it('does not display the social share buttons when showMobileShareLinks is false', async () => {
		const args = {
			...baseArgs,
			showMobileShareLinks: false
		}
		const subject = mount(<ShareArticleModal {...args} actionsRef={(a) => Object.assign(actions, a)} />)

		await actions.activate()

		await actions.shortenNonGiftUrl()

		subject.update()

		expect(subject.find('#social-share-buttons')).not.toExist()
	})
})
