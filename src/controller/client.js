const puppeteer = require('puppeteer-core');
//const { executablePath } = require('puppeteer')
//const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const config = require("../../config/browser")
const fs = require("fs").promises
const dotenv = require('dotenv');
dotenv.config();
const { PORTAL_URL, USER, SENHA } = process.env;
//puppeteer.use(StealthPlugin());

//console.log(executablePath())

let launchOptions = {
    headless: false,
    userDataDir: './cache',
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome",
    //executablePath: 'C:\\Program Files\\Google\\Chrome\\Application', //'/usr/bin/chromium-browser', // because we are using puppeteer-core so we must define this option
    // args: config.browser,
    args: ['--no-sandbox'],
    ignoreDefaultArgs: ["--disable-extensions"],
    slowMo: 100,
};

const auth = async () => {

    return new Promise((resolve) => {
        puppeteer.launch(launchOptions).then(async browser => {
            const page = await browser.newPage()
            await page.setViewport({
                width: 1024,
                height: 768
            });
            await page.setJavaScriptEnabled(true);
            const cookiesString = await fs.readFile("./cookies/cookies.json");
            const cookies = JSON.parse(cookiesString);
            // await page.setCookie(...cookies);
            await page.goto(PORTAL_URL, { waitUntil: "networkidle2", timeout: 0 });

            //await page.waitForNavigation(2000);
            let logged = await verifyLogged(page);

            if (logged) {
                resolve(page);
                return;
            }

            // await page.setViewport({ width: 734, height: 1024 });

            await page.waitForSelector('input[data-qe-id="trauth-signin-uid"]', { visible: true });
            await page.type('input[data-qe-id="trauth-signin-uid"]', USER);

            await page.waitForSelector('input[data-qe-id="trauth-signin-pwd"]', { visible: true });
            await page.type('input[data-qe-id="trauth-signin-pwd"]', SENHA);

            // await page.waitForNavigation(5000);

            await page.keyboard.press("Enter");

            //await page.screenshot({ path: `./teste.jpg` });

            // await browser.close();
            resolve(page);
        })
    })


}


const verifyLogged = async (page) => {
    return new Promise(async (resolve) => {

        const isLoggedIn = await page.evaluate(async () => {
            return await new Promise(resolve => {
                // Insira aqui a lógica para verificar se está logado.
                // Por exemplo, você pode procurar por elementos específicos que só são visíveis quando o usuário está logado.
                // Se encontrar esses elementos, retorne true; caso contrário, retorne false.
                resolve(document.querySelector('.header__username') !== null);
            })
        });
        console.log(isLoggedIn)
        if (isLoggedIn) {
            resolve(true)
        } else {
            resolve(false)
        }
    })
}

module.exports = { auth };