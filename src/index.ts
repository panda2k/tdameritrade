import axios, {AxiosInstance} from 'axios'
import { SubmitTokenResponse, UserPrincipleField, UserPrincipleDetails } from './types'
import qs = require('qs')
import WebSocket = require('isomorphic-ws')

class TDAmeritrade {
	CONSUMER_KEY: string
	client: AxiosInstance
	refreshToken: string | undefined 
	socket: WebSocket | undefined
	principles: UserPrincipleDetails | undefined

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

	async getNewAccessToken(): Promise<SubmitTokenResponse> {
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

	async getUserPrincipals(fields?: UserPrincipleField[]): Promise<UserPrincipleDetails> {
		const allFields: UserPrincipleField[] = ["streamerSubscriptionKeys", "streamerConnectionInfo", "preferences", "surrogateIds"]
		const response = (await this.client.get('/userprincipals', {params: {fields: fields ? fields.join(',') : allFields.join(',')}}))

		return response.data as UserPrincipleDetails		
	}

	async initializeWebsocket(onOpen: () => any): Promise<void> {
		this.principles = await this.getUserPrincipals()
		const request = {
			requests: [
				{
					service: "ADMIN",
					command: "LOGIN",
					requestid: 0,
					account: this.principles.accounts[0].accountId,
					source: this.principles.streamerInfo.appId,
					parameters: {
						credential: qs.stringify({
							userid: this.principles.accounts[0].accountId,
							token: this.principles.streamerInfo.token,
							company: this.principles.accounts[0].company,
							segment: this.principles.accounts[0].segment,
							cddomain: this.principles.accounts[0].accountCdDomainId,
							usergroup: this.principles.streamerInfo.userGroup,
							accesslevel: this.principles.streamerInfo.accessLevel,
							authorized: "Y",
							timestamp: (new Date(this.principles.streamerInfo.tokenTimestamp)).getTime(),
							appid: this.principles.streamerInfo.appId,
							acl: this.principles.streamerInfo.acl
						}),
						token: this.principles.streamerInfo.token,
						version: "1.0"
					}
				}
			]
		}
		const socket = new WebSocket(`wss://${this.principles.streamerInfo.streamerSocketUrl}/ws`) 
		socket.onmessage = (evt: any) => {
			const data: any = JSON.parse(evt.data)
			console.log(JSON.stringify(data))
			if (data.response && data.response[0].service == "ADMIN") {
				onOpen()
			}
		}
		socket.onclose = () => console.log('Closed socket')

		socket.on('open', () => {console.log('opened'); socket.send(JSON.stringify(request));})

		this.socket = socket	
	}

	subscribeToAccountActivity() {
		if (!this.socket || !this.principles) {
			throw new Error('Socket not intialized yet. Run initializeWebsocket()')
		}
		const request = {
			requests: [{
				service: "ACCT_ACTIVITY",
				requestid: 1,
				command: "SUBS",
				account: this.principles.accounts[0].accountId,
				source: this.principles.streamerInfo.appId,
				parameters: {
					keys: this.principles.streamerSubscriptionKeys.keys[0].key,
					fields: "0,1,2,3"
				}
			}]
		}

		this.socket!.send(JSON.stringify(request))
	}

	getOauthLink(redirectUri: string) {
		return `https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${encodeURIComponent(this.CONSUMER_KEY)}%40AMER.OAUTHAP`
	}
}

export = TDAmeritrade

