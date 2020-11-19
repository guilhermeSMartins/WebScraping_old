const requestPromise = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')
const request = require('request')
const Json2csvParser = require('json2csv').Parser

const URLS = [
    {
        url: 'https://www.imdb.com/title/tt8946378/?ref_=hm_stp_pvs_piv_tt_1',
        id: 'knives_out'
    },
    {
        url: 'https://www.imdb.com/title/tt8579674/?ref_=nv_sr_srsg_0',
        id: '1917'
    }
]

const a = async () => {
    let moviesData = []
    for (let movie of URLS) {
        const response = await requestPromise(
            {
                uri: movie.url,
                headers: {
                    'accept': "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    'accept-encoding': "gzip, deflate, br",
                    'accept-language': "en-US,en;q=0.9",
                    'cache-control': "max-age=0",
                    'sec-fetch-dest': "document",
                    'sec-fetch-mode': "navigate",
                    'sec-fetch-site': "none",
                    'sec-fetch-user': "?1",
                    'upgrade-insecure-requests': "1",
                    'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
                },
                gzip: true
            }
        )

        let $ = cheerio.load(response)

        let title = $('div[class="title_wrapper"] > h1').text().trim()
        let rating = $('span[itemprop="ratingValue"]').text()
        let duration = $('div[class="subtext"] > time').text().trim()
        let poster = $('div[class="poster"] > a > img').attr('src')
        let reviews = $('#title-overview-widget > div.plot_summary_wrapper > div.titleReviewBar > div.titleReviewBarItem.titleReviewbarItemBorder > div:nth-child(2) > span > a:nth-child(1)').text()
        let genres = []
        $('div[class="title_wrapper"]  a[href^="/search/"]').each((i, e) => {
            let genre = $(e).text()
            genres.push(genre)
        })

        moviesData.push({
            title,
            rating,
            duration,
            genres,
            poster,
            reviews,
            movie: movie.url
        })

        let file = fs.createWriteStream(`${movie.id}.jpg`,)

        await new Promise((resolve, reject) => {
            let stream = request({
                uri: poster,
                headers: {
                    'accept': "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    'accept-encoding': "gzip, deflate, br",
                    'accept-language': "en-US,en;q=0.9",
                    'cache-control': "max-age=0",
                    'sec-fetch-dest': "document",
                    'sec-fetch-mode': "navigate",
                    'sec-fetch-site': "none",
                    'sec-fetch-user': "?1",
                    'upgrade-insecure-requests': "1",
                    'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
                },
                gzip: true
            }).pipe(file)
              .on('finish', _ => {
                  console.log(`${movie.id} has finished downloading the image.`)
                  resolve()
              })
              .on('error', (err) => {
                  reject(err)
              })
        }).catch(err => {
            console.log(`${movie.id} has an error on download. ${err}`)
        })

        // const fields = ['title', 'rating']

        // const _Json2csvParser = new Json2csvParser({ fields })
        // const csv = _Json2csvParser.parse(moviesData)

        //fs.writeFileSync('./data.csv', csv, 'utf-8')
        //fs.writeFileSync('./data.json', JSON.stringify(moviesData), 'utf-8')

    }
}
a()