const puppeteer = require('puppeteer')

let browser = null
let page = null

const BASE_URL = 'https://amazon.com/'

const amazon = {
    initialize: async() => {
        console.log('starting the scraper...')
        browser = await puppeteer.launch({
            headless: false
        })
        page = await browser.newPage()

        await page.goto(BASE_URL, { waitUntil: 'networkidle2' })
        console.log('scraper started')
    },
    
    getProductDetails: async(link) => {
        console.log('Getting product details...')

        await page.goto(link, { waitUntil: 'networkidle2' })

        let details = await page.evaluate(_ => {

            return {
                title: document.querySelector('span[id="productTitle"]').innerText,
                from: document.querySelector('a[id="bylineInfo"],span > a[data-asin]').innerText,
                price: document.querySelector('span[id="priceblock_ourprice"],span.a-color-base > span.a-size-base').innerText,
               // rating: document.querySelector('i.a-icon-star > span').innerText,
                ratingAmount: document.querySelector('span > a.a-link-normal > span,span > a[href="#customerReviews"] > span').innerText
            }
        })
        console.log(details)
    },
    end: async() => {
        console.log('stopping the scraper...')
        await browser.close()
    }
}

module.exports = amazon