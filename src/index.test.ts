import TDAmeritrade from './index'
import 'dotenv/config'
import readline = require('readline')
import open = require('open')
import fs = require('fs/promises')
import data from '../data.json'

const redirectUri = 'https://localhost:3000'
const td = new TDAmeritrade(process.env['CONSUMER_KEY']!)

const getNewToken = async(): Promise<string> => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})

	open(td.getOauthLink(redirectUri))
	const code = (await new Promise(resolve => rl.question('Input the code from the browser URL: ', resolve))) as string
	return code
}

const loadSavedToken = async(): Promise<boolean> => {
	td.refreshToken = data.refresh_token
	try {
		await td.getNewAccessToken()
		return true
	} catch (error) {
		return false
	}
}

const saveToken = async(): Promise<void> => {
	data.refresh_token = String(td.refreshToken)
	await fs.writeFile('./data.json', JSON.stringify(data))
}

(async() => {
	// check login auth
	const validToken = await loadSavedToken()			
	if (!validToken) {
		const code = await getNewToken()	

		const getTokenResponse = await td.submitAuthToken(code, true, redirectUri)	
		console.log(getTokenResponse.token_type)

		const refreshResponse = await td.getNewAccessToken()
		console.log(refreshResponse.token_type)
	}
	await saveToken()
	// test websockets
	await td.initializeWebsocket(() => td.subscribeToAccountActivity())
})()

