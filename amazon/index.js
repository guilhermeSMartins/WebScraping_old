const amazon = require('./amazon')

async function am() {
    await amazon.initialize()
    await amazon.getProductDetails( 'https://www.amazon.com/-/pt/gp/product/B01NASW99J/ref=ox_sc_saved_title_1?smid=A1DK8X49Q77HCT&psc=1')
    debugger
    await amazon.end()
}
am()