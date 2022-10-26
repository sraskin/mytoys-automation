const should = require("should");
const chai = require("chai");
const expect = chai.expect;
const {Builder, Key, By} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const screen = {width: 640, height: 480};
//for headless chrome
// let driver = new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().addArguments('--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage').windowSize(screen)).build();
//for gui version chrome
let driver = new Builder().forBrowser('chrome').build();

const base_url = "https://www.mytoys.de/"

describe("myToys website browser automation test", function () {
    it("Should Open the website, search 'trampolin', sort by higher price and verify the whether it is showing the correct order ", function () {
        (async function test() {
            try {
                await driver.get(base_url + 'suche/trampolin/?sort=priceDesc');
                await driver.sleep(4000);
                const products = await driver.findElements(By.tagName('article'));
                let trampolin_top_five_higest_prices = []
                for (let i = 0; i < 5; i++) {
                    let product_price_res = products[i].findElement(By.css('.prod-tile__spacer')).getText();
                    product_price_res.then((price) => {
                        let remove_dot = price.replace(/\./g, '');
                        let replace_comma_to_dot = remove_dot.replace(/,/g, '.')
                        let parse_to_float = parseFloat(replace_comma_to_dot)
                        trampolin_top_five_higest_prices.push(parse_to_float)
                        if (trampolin_top_five_higest_prices.length === 5) {
                            let sorted_arr = trampolin_top_five_higest_prices.sort((a, b) => b - a)
                            console.log("Top 5 higher price product(desc) =>", trampolin_top_five_higest_prices)
                            console.log("Sorted Top 5 higher price product(desc)", sorted_arr)
                            if (trampolin_top_five_higest_prices.join() === sorted_arr.join()) {
                                console.log("Category 'Highest Price' showing price in correct order")
                            } else console.log("Category 'Highest Price' not showing price in correct order")
                            expect(trampolin_top_five_higest_prices.length === 5).to.be.true;
                            expect(trampolin_top_five_higest_prices.join() == sorted_arr.join()).to.be.true;
                        }
                    })
                }
            } catch (e) {
                console.error('test_selenium' + e);
            } finally {
                driver.quit();
            }
        })();
    });
})