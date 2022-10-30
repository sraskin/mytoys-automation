const should = require("should");
const chai = require("chai");
const expect = chai.expect;
const {Builder, Key, By} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const screen = {width: 640, height: 480};

/*
If you want to run it in headless mode, please comment out the headless chrome line (line 12) and comment line 14
 */

//for headless chrome
// let driver = new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().addArguments('--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage').windowSize(screen)).build();
//for gui version chrome
let driver = new Builder().forBrowser('chrome').build();

const base_url = "https://www.mytoys.de/"
//issue, product price showing name is not good
describe("myToys website browser automation test", function () {
    it("Should Open the website, search 'trampolin', sort by higher price and verify the whether it is showing the correct order ", function () {
        (async function test() {
            try {
                /*
                "Finding the search box, populate with the text "trampolin" then click the search button" this action sometime gone failed due to unavailability of DOM content, or sometimes it
                took some time to load. I have noticed I can use URL to attempt searching and I have chose this way to be certain that my targeted paged is loaded successfully.
                If needed I can find the text box, sent the text "trampolin", click the search button and do the rest of the action.
                */

                //loading the reasult page with "trampolin" with higher price descending order
                await driver.get(base_url + 'suche/trampolin/?sort=priceDesc');
                //wait for the page to load
                await driver.sleep(4000);
                //get all the products
                const products = await driver.findElements(By.tagName('article'));
                //this array will store first five prices
                let trampolin_top_five_higest_prices = []
                /*
                This array will go to first five elements one by one, get the price, remove the dot, replace the comma with dot and make a float number and push it to the array. after that
                it will sort the array values to be more certain that it has the amounts with right order than it'll match them with page that is the page showing the right order.
                */
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
                await driver.sleep(2000);
                /*
                - load the page that have "trampolin" with high to low price order and price range is 500 to 1000.
                - save product brand, name, price and link on the variable and click for a product details
                - then get the brand, name. price and current URL and match with the previously saved content
                - then click the add to cart check the success message with brand, name and price
                - then click the go-to cart page
                 */
                await driver.get(base_url + 'suche/trampolin/?sort=priceDesc&pricemin=500&pricemax=1000');
                await driver.sleep(2000);
                const details_products = await driver.findElements(By.tagName('article'));
                let product_brand_on_product_list = await details_products[0].findElement(By.css('.prod-tile__brand')).getText();
                let product_name_on_product_list = await details_products[0].findElement(By.css('.prod-tile__name')).getText();
                let product_price_on_product_list;
                try {
                    product_price_on_product_list = await details_products[0].findElement(By.css('.prod-info__price-regular')).getText();
                } catch (e) {
                    product_price_on_product_list = await details_products[0].findElement(By.css('.prod-tile__price-reduced')).getText();
                }
                let product_link_on_product_list = await details_products[0].findElement(By.css('.prod-tile__link')).getAttribute('href');
                await driver.findElement(By.css('#onetrust-accept-btn-handler')).click();
                await driver.sleep(500);
                await details_products[0].click()
                let product_brand_on_details = await driver.findElement(By.css('.prod-info__brand-link')).getText();
                let product_name_on_details_body = await driver.findElement(By.css('.prod-info__name')).getText();
                const product_name_on_details = product_name_on_details_body.split(/\r?\n/);
                let product_price_on_details;
                try {
                    product_price_on_details = await driver.findElement(By.css('.prod-info__price-regular')).getText();
                } catch (e) {
                    product_price_on_details = await driver.findElement(By.css('.prod-info__price-reduced')).getText();
                }
                let product_details_url = await driver.getCurrentUrl();
                await expect(product_brand_on_product_list).to.be.equal(product_brand_on_details);
                await expect(product_name_on_product_list).to.be.equal(product_name_on_details[1]);
                await expect(product_price_on_product_list).to.be.equal(product_price_on_details);
                await expect(product_link_on_product_list).to.be.equal(product_details_url);

                await driver.findElement(By.css('.btn--add-to-cart')).click();
                await driver.sleep(4000);
                const add_to_cart_success_layer_body = await driver.findElement(By.css('.js-layer-add-to-cart'));
                //Der Artikel wurde deinem Warenkorb hinzugefügt.
                const add_success_message = await add_to_cart_success_layer_body.findElement(By.css('.msg-success')).getText();
                const success_layer_brand = await add_to_cart_success_layer_body.findElement(By.css('.layer__prod-brand')).getText();
                const success_layer_name = await add_to_cart_success_layer_body.findElement(By.css('.layer__prod-name')).getText();
                let success_layer_price;
                try {
                    success_layer_price = await add_to_cart_success_layer_body.findElement(By.css('.layer__prod-price-regular')).getText();
                } catch (e) {
                    success_layer_price = await add_to_cart_success_layer_body.findElement(By.css('.layer__prod-price-reduced')).getText();
                }
                await expect(add_success_message).to.be.equal('Der Artikel wurde deinem Warenkorb hinzugefügt.');
                await expect(product_brand_on_details).to.be.equal(success_layer_brand);
                await expect(product_name_on_details[1]).to.be.equal(success_layer_name);
                await expect(product_price_on_details).to.be.equal(success_layer_price);

                await add_to_cart_success_layer_body.findElement(By.css('.btn--add-to-cart')).click();
                await driver.sleep(2000);

                /*
                !! There are some kind of issues to lead the cart page. I tried several times with different page, but it shows the same error.
                Though on top, cart icon shows that there is a product on the cart.

                Error shows:
                            Leider haben wir ein Problem festgestellt
                            Error 403
                            Um das Problem zu lösen, kannst Du folgende Optionen ausprobieren:
                            1. Ver suche es bitte mit einem anderen Browser, wie z.B. Chrome oder Firefox
                            2. Wec hsel in ein anderes WLAN Netzwerk oder nutze die Mobilfunkverbindung Deines Handys
                            3. Lös che die Cookies in Deinem Browser
                            Sollte das Problem weiterhin bestehen, kannst Du Deine Bestellung gerne über unseren Kundenservice tätigen. Hier geht's zum Kundenservice
                 */
                const cart_page_body = await driver.findElement(By.css('.content-container')).getText();
                console.log(cart_page_body)


                await driver.sleep(2000);
            } catch (e) {
                console.error('test_selenium' + e);
            } finally {
                driver.quit();
            }
        })();
    });
})