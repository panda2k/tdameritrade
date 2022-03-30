import axios, {AxiosInstance} from 'axios'
import { SubmitTokenResponse } from './types'
import qs = require('qs')

class TDAmeritrade {
	CONSUMER_KEY: string
	client: AxiosInstance
	refreshToken: string | undefined 

	constructor(consumerKey: string) {
		this.CONSUMER_KEY = consumerKey
		this.client = axios.create({baseURL: 'https://api.tdameritrade.com/v1'})
	}
	async submitAuthToken(token: string, offline: boolean, redirectUri: string): Promise<SubmitTokenResponse> {
		const response = (await this.client.post(
			'/oauth2/token',
			qs.stringify({
				grant_type: "authorization_code",
				code: decodeURIComponent(token),
				access_type: offline ? "offline" : "",
				client_id: `${this.CONSUMER_KEY}@AMER.OAUTHAP`,
				redirect_uri: redirectUri
			})
		)).data as SubmitTokenResponse 

		this.client.defaults.headers.common['Authorization'] = `Bearer ${response.access_token}`
		this.refreshToken = response.refresh_token
		return response
	}

	async getNewAccessToken() {
		delete this.client.defaults.headers.common['Authorization']
		const response = (await this.client.post(
			'/oauth2/token',
			qs.stringify({
				grant_type: "refresh_token",
				refresh_token: this.refreshToken,
				client_id: `${this.CONSUMER_KEY}@AMER.OAUTHAP`,
			})
		)).data as SubmitTokenResponse	
		this.client.defaults.headers.common['Authorization'] = `Bearer ${response.access_token}`
		return response
	}

	getOauthLink(redirectUri: string) {
		return `https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${encodeURIComponent(this.CONSUMER_KEY)}%40AMER.OAUTHAP`
	}
}

export = TDAmeritrade

