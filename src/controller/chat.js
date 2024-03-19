const puppeteer = require('puppeteer-core');
//const { executablePath } = require('puppeteer')
//const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const config = require("../../config/browser")
const fs = require("fs").promises
//puppeteer.use(StealthPlugin());

//console.log(executablePath())

let launchOptions = {
  headless: "new",
  executablePath: '/usr/bin/chromium-browser', // because we are using puppeteer-core so we must define this option
  args: config.browser,
  ignoreDefaultArgs: ["--disable-extensions"],
  slowMo: 100,
};

const chat = async (input) => {
  return new Promise((resolve) => {
    puppeteer.launch(launchOptions).then(async browser => {
      const page = await browser.newPage()
      await page.setViewport({
        width: 1920 + Math.floor(Math.random() * 100),
        height: 3000 + Math.floor(Math.random() * 100),
        deviceScaleFactor: 1,
        hasTouch: false,
        isLandscape: false,
        isMobile: false,
      });
      await page.setJavaScriptEnabled(true);
      const cookiesString = await fs.readFile("./cookies/cookies.json");
      const cookies = JSON.parse(cookiesString);
      await page.setCookie(...cookies);
      await page.goto('https://chat.openai.com/chat', { waitUntil: "networkidle2" })
      await page.setDefaultTimeout(0);

      await page.waitForSelector("textarea", { visible: true });
      await page.type("textarea", input);
      await page.keyboard.press("Enter");
      await page.waitForSelector(".h-4.w-4.mr-1", { visible: true });
      const response = await page.$eval("div.flex.flex-grow.flex-col.gap-3 > div > div", (response) => {
        return response.innerText;
      })
      await browser.close();
      resolve(response);
    })
  })


}

module.exports = chat;