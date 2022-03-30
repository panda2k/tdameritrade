import TDAmeritrade from './index'
import 'dotenv/config'
import readline = require('readline')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

const td = new TDAmeritrade(process.env['CONSUMER_KEY']!)
console.log(`Login here: ${td.getOauthLink('https://localhost:3000')}`)

rl.question('Input the code from the browser URL', async(code) => {
  	const getTokenResponse = await td.submitAuthToken(code, true, 'https://localhost:3000')	
	console.log(getTokenResponse)
	const refreshResponse = await td.getNewAccessToken()
	console.log(refreshResponse)
	rl.close();
});

