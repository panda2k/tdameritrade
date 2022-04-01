export interface SubmitTokenResponse {
	access_token: string,
	refresh_token: string,
	token_type: string,
	expires_in: number,
	scope: string,
	refresh_token_expires_in: number
}

export type UserPrincipleField = "streamerSubscriptionKeys" | "streamerConnectionInfo" | "preferences" | "surrogateIds"

export interface UserPrincipleDetails {
	authToken: string,
	userId: string,
	userCdDomainId: string,
	primaryAccountId: string,
	lastLoginTime: string,
	tokenExpirationTime: string,
	loginTime: string,
	accessLevel: string,
	stalePassword: false,
	streamerInfo: {
		streamerBinaryUrl: string,
		streamerSocketUrl: string,
		token: string,
		tokenTimestamp: string,
		userGroup: string,
		accessLevel: string,
		acl: string,
		appId: string
	},
	professionalStatus: 'PROFESSIONAL' | 'NON_PROFESSIONAL' | 'UNKNOWN_STATUS',
	quotes: {
		isNyseDelayed: false,
		isNasdaqDelayed: false,
		isOpraDelayed: false,
		isAmexDelayed: false,
		isCmeDelayed: false,
		isIceDelayed: false,
		isForexDelayed: false
	},
	streamerSubscriptionKeys: {
		keys: {
			key: string
		}[]
	},
	accounts: AccountDetails[]
}

export interface AccountDetails {
	accountId: string,
	description: string,
	displayName: string,
	accountCdDomainId: string,
	company: string,
	segment: string,
	surrogateIds: object,
	preferences: {
		expressTrading: false,
		directOptionsRouting: false,
		directEquityRouting: false,
		defaultEquityOrderLegInstruction: 'BUY' | 'SELL' | 'BUY_TO_COVER' | 'SELL_SHORT' | 'NONE',
		defaultEquityOrderType: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT' | 'TRAILING_STOP' | 'MARKET_ON_CLOSE' | 'NONE',
		defaultEquityOrderPriceLinkType: 'VALUE' | 'PERCENT' | 'NONE',
		defaultEquityOrderDuration: 'DAY' | 'GOOD_TILL_CANCEL' | 'NONE',
		defaultEquityOrderMarketSession: 'AM' | 'PM' | 'NORMAL' | 'SEAMLESS' | 'NONE',
		defaultEquityQuantity: 0,
		mutualFundTaxLotMethod: 'FIFO' | 'LIFO' | 'HIGH_COST' | 'LOW_COST' | 'MINIMUM_TAX' | 'AVERAGE_COST' | 'NONE',
		optionTaxLotMethod: 'FIFO' | 'LIFO' | 'HIGH_COST' | 'LOW_COST' | 'MINIMUM_TAX' | 'AVERAGE_COST' | 'NONE',
		equityTaxLotMethod: 'FIFO' | 'LIFO' | 'HIGH_COST' | 'LOW_COST' | 'MINIMUM_TAX' | 'AVERAGE_COST' | 'NONE',
		defaultAdvancedToolLaunch: 'TA' | 'N' | 'Y' | 'TOS' | 'NONE' | 'CC2',
		authTokenTimeout: 'FIFTY_FIVE_MINUTES' | 'TWO_HOURS' | 'FOUR_HOURS' | 'EIGHT_HOURS'
	},
	acl: string,
	authorizations: {
		apex: false,
		levelTwoQuotes: false,
		stockTrading: false,
		marginTrading: false,
		streamingNews: false,
		optionTradingLevel: 'COVERED' | 'FULL' | 'LONG' | 'SPREAD' | 'NONE',
		streamerAccess: false,
		advancedMargin: false,
		scottradeAccount: false
	}
}

