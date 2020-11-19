const puppeteer = require('puppeteer')

const a = async () => {
    const browser = await puppeteer.launch({
        //devtools: true,
        //ignoreHTTPSErrors: true,
        defaultViewport: {
            width: 1000,
            height: 1000
        },
        //args: ['--proxy-server=ip:port'],
        headless: false //browser will start and show if false
    })
    const page = await browser.newPage()

    //BASIC AUTH
    await page.authenticate({ username: 'admin', password: '123456' })
    await page.goto('https://httpbin.org/basic-auth/admin/123456')
    
    //OPTIMIZATION
    await page.setRequestInterception(true)
    page.on('request', (request) => {
        if(['image', 'stylesheet', 'font'].includes(request.resourceType())) {
            request.abort()
        } else {
            request.continue()
        }
    })

    await page.goto('https://amazon.com')
    
    //Phone
    const devices = require('puppeteer/DeviceDescriptors')
    await page.emulate(devices['iPhone 4'])

    await page.goto('https://www.google.com')
    await page.type('[jsaction="paste:puy29d"]', '創の軌跡', {delay: 100})
    await page.keyboard.press('Enter')
    await page.waitForNavigation()

    await page.screenshot({path: 'print.png'})

    await browser.close()

    //Getting URl or title of current page
    // let title = await page.title()
    // let url = await page.url()
    // console.log(title, url)

    //PDF
    // await page.pdf({
    //     path: './page.pdf',
    //     format: 'A4'
    // })
}
//a()

//SCRAPING
const c = async() => {
    const browser = await puppeteer.launch({
        headless: true
    })
    const page = browser.newPage()
    
    await (await page).goto('https://learnscraping.com', { waitUntil: 'networkidle0'})


    let details = (await page).evaluate(() => {

        let getInnerText = selector => {
            document.querySelector(selector) ? document.querySelector(selector).innerText : false
        }

        return {
            title: getInnerText('h1[class="site-title"]'),
            description: getInnerText('test[class="test"]'),
            invalid: getInnerText('test[class="test"]')
        }
    })
    
}
c()