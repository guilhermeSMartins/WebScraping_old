const puppeteer = require('puppeteer')

const URL = 'https://twitter.com/login?lang=pt'

let browser = null
let page = null

const twitterFunction = {
    initialize: async (param) => {
        browser = await puppeteer.launch({
            headless: param,
            //devtools: true
        })

        page = await browser.newPage()
    },
    login: async (username, password) => {
        await page.goto(URL)

        await page.waitFor('input[autocapitalize="none"]')

        await page.type('input[autocapitalize="none"]', username, { delay: 100 })
        await page.type('input[name="session[password]"]', password, { delay: 50 })

        await page.click('div[dir="auto"]>span>span')
    },
    tweet: async () => {
        await page.waitFor('div[data-block="true"]')
        await page.click('div[data-block="true"]')
        await page.type('div[data-block="true"]', 'post pro linkedin, diga X!', { delay: 100 })

        await page.click('div[dir="auto"]>span>span')
    },
    scrollAndLike: async (username, count = 10) => {
        const userURL = `https://twitter.com/${username}`
        await page.waitForNavigation()

        await page.goto(userURL)
        await page.waitFor(2000)

        let tweetsArray = await page.$$('article[role="article"]')
        // await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        let lastTweetsArrayLength = 0
        let tweets = []
     
        while (tweetsArray.length < count) {
            await page.evaluate(`window.scrollTo(0, document.body.scrollHeight)`)
            await page.waitFor(3000)
            tweetsArray = await page.$$('article[role="article"] > div > div')
            
            if(lastTweetsArrayLength == tweetsArray.length) break

            lastTweetsArrayLength = tweetsArray.length
        }

        for (let tweetElement of tweetsArray) {
            await tweetElement.click('article[role="article"] div[data-testid="like"] svg > g > path')
            await page.waitFor(3000)
        }
        debugger
    },
    getUserTweets: async (username, count = 10) => {
        const userURL = `https://twitter.com/${username}`
        let url = await page.url()
        if (url != userURL) {
            await page.goto(userURL)
        }

        await page.waitForNavigation()

        const tweetsArray = await page.$$('article[role="article"] > div > div')

        while (tweetsArray.length < count) {
            await page.evaluate(`window.scrollTo(0, document.body.scrollHeight)`)
            await page.waitFor(3000)
            tweetsArray = await page.$$('article[role="article"] > div > div')
        }
        const tweets = []
        for (const tweetElement of tweetsArray) {
            let tweet = await tweetElement.$eval('')
            let ownerName = await tweetElement.$eval('a[role="link"] > div > div > div[dir="auto"] > span > span', e => e.innerText)
            const tweetOject = {
                ownerName: await twit.$eval('a[role="link"] > div > div > div[dir="auto"] > span > span', e => e.innerText),
                ownerID: await twit.$eval('a[role="link"] > div > div > div[dir="ltr"] > span', e => e.innerText),
                text: await twit.$eval('div[lang] > span', e => e.innerText)
            }
            tweets.push(tweetOject)
            console.log(ownerName)
        }
    },
    userDetails: async (username) => {
        const userURL = `https://twitter.com/${username}`

        let url = await page.url()
        if (url != userURL) {
            await page.goto(userURL)
        }

        // let user = await page.evaluate(() => { //access browser console (write and read)
        //     return document.querySelector('div > div[dir="auto"] > span > span').innerText
        // })
        // console.log(user)

        // let userID = await page.evaluate(() => {
        //     return document.querySelector('div[dir="ltr"] > span').innerText
        // })

        // let bio = await page.evaluate(() => {
        //     return document.querySelector('#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div:nth-child(3) > div > div > span')
        // })
        // let place = await page.evaluate(() => {
        //     return document.querySelector('div[dir="auto"] > span > span > span').innerText
        // })
        // let userInfo = await page.evaluate(() => {
        //     return {
        //         user:  document.querySelector('div > div[dir="auto"] > span > span') ? document.querySelector('div > div[dir="auto"] > span > span').innerText : false,
        //         userID: document.querySelector('div[dir="ltr"] > span') ? document.querySelector('div[dir="ltr"] > span').innerText : false,
        //         bio: document.querySelector('#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div:nth-child(3) > div > div > span'),
        //         place: document.querySelector('div[dir="auto"] > span > span > span').innerText ? document.querySelector('div[dir="auto"] > span > span > span').innerText : false
        //     }
        // })
        // const userInfo = {
        //     user: await page.$eval('#react-root > div > div > div.css-1dbjc4n.r-13qz1uu.r-417010 > main > div > div > div > div > div > div > div > div > div:nth-child(1) > div > div.css-1dbjc4n.r-15d164r.r-1g94qm0 > div > div > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-dnmrzs > div > span:nth-child(1) > span', e => e.innerText),
        //     userID: await page.$('div[dir="ltr"] > span')
        // }
        // debugger
        // console.log(userInfo)

    }
}

module.exports = twitterFunction