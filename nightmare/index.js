const Nightmare = require('nightmare')
const nightmare = Nightmare({
    show: true,
    // openDevTools: {
    //     node: 'detach'
    // }
})

const a = async () => {
    await nightmare.viewport(1200, 800)
    await nightmare.goto('https://news.ycombinator.com/')

    let articles = await nightmare.evaluate(() => {
        let tableRows = document.querySelectorAll('table[class="itemlist"] > tbody > tr')

        articles = []
    
        for (let row of tableRows) {
            if(row.getAttribute('class') == 'spacer') continue
            if(row.getAttribute('class') == 'athing') {
                let title = row.querySelector('td[class="title"] > a').innerHTML
                let url = row.querySelector('td[class="title"] > a').getAttribute('href')
                let source = row.querySelector('span.sitestr').innerText ? row.querySelector('span.sitestr').innerText : false
                
                let secondRow = row.nextSibling()

                articles.push({ title, url, source })
            }
        }

        return articles

    })
    console.log(articles)
    // let pageHeight = await nightmare.evaluate(() => document.body.scrollHeight)

    // await nightmare.scrollTo(pageHeight, 0)
    debugger
}
a()