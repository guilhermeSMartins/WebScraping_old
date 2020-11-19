const puppeteer = require('puppeteer')
const twitterFunction = require('./twitter')

const tt = async () => {
    const USERNAME = 'holomariaserver@gmail.com'
    const PASSWORD = 'pNQfyF9x'

    await twitterFunction.initialize(false)

    await twitterFunction.login(USERNAME, PASSWORD)
    await twitterFunction.scrollAndLike('mitakarupau')
}
tt()