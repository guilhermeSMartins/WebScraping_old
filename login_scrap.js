const request = require('request-promise')
const cheerio = require('cheerio')

const a = async () => {

    console.log(`Initial request to get the csrf_token value...`)
    let initialRequest = await request({
        uri:'http://quotes.toscrape.com/login',
        method: 'GET',
        gzip: true,
        resolveWithFullResponse: true
    })

    /* Parsing the cookies */
    let cookie = initialRequest.headers['set-cookie'].map(value => value.split(';')[0]).join(' ')

    let $ = cheerio.load(initialRequest)

    let csrfToken = $('input[name="csrf_token"]').val()

    console.log(`POST Request to login on the form`)
    try {
        let loginRequest = await request({
            uri: 'http://quotes.toscrape.com/login',
            method: 'POST',
            gzip: true,
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "Accept-Encoding": "gzip, deflate",
                "Accept-Language": "en-US,en;q=0.9",
                "Cache-Control": "max-age=0",
                "Connection": "keep-alive",
                "Cookie": cookie,
                "Host": "quotes.toscrape.com",
                "Upgrade-Insecure-Requests": "1",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari"
            },
            form: {
                'csrf_token': csrfToken,
                'username': 'rupau',
                'password': 'rupau'
            },
            resolveWithFullResponse: true
        })   
    } catch (response) {
        cookie = response.response.headers['set-cookie'].map(value => value.split(';')[0]).join(' ')
    }

    let loggedInResponse = await request({
        uri: 'http://quotes.toscrape.com/',
        method: 'GET',
        gzip: true,
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "max-age=0",
            "Connection": "keep-alive",
            "Cookie": cookie,
            "Host": "quotes.toscrape.com",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari"
        },
        form: {
            'csrf_token': csrfToken,
            'username': 'rupau',
            'password': 'rupau'
        },
        resolveWithFullResponse: true
    })
}
a()