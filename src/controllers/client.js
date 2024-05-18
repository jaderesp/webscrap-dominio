const puppeteer = require('puppeteer-core');
//const { executablePath } = require('puppeteer')
//const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const config = require("../../config/browser")
const fs = require("fs")
const dotenv = require('dotenv');
dotenv.config();
const { PORTAL_URL, USER, SENHA, FLAG_OS, WINDOWS_PATCH, LINUX_PATCH } = process.env;
var sessions = []
//puppeteer.use(StealthPlugin());

//console.log(executablePath())

/* 
    usuario e senha do funcionario devera ser armazenado em banco de dados para resgate automatico (login da api)
    usando como parametros de identificação o cpf do funcionario
*/
const auth = async (idFuncionario) => {

    return new Promise((resolve) => {

        if (!idFuncionario) {
            console.log("\r\n idFuncionario não informado");
            resolve(false);
        }


        let launchOptions = {
            headless: false,
            userDataDir: `./cache/${idFuncionario}`,
            executablePath: (FLAG_OS == 'windows') ? WINDOWS_PATCH : LINUX_PATCH,
            //executablePath: 'C:\\Program Files\\Google\\Chrome\\Application', //'/usr/bin/chromium-browser', // because we are using puppeteer-core so we must define this option
            // args: config.browser,
            args: ['--no-sandbox'],
            ignoreDefaultArgs: ["--disable-extensions"],
            slowMo: 100,
        };

        puppeteer.launch(launchOptions).then(async browser => {
            const page = await browser.newPage()
            await page.setViewport({
                width: 1024,
                height: 768
            });

            //configurações de download
            const client = await page.target().createCDPSession();
            await client.send('Page.setDownloadBehavior', {
                behavior: 'allow',
                downloadPath: "./public/files/download",
            })

            await page.setJavaScriptEnabled(true);

            await page.goto(PORTAL_URL, { waitUntil: "networkidle2", timeout: 0 });

            // await page.waitForNavigation()

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
            await page.waitForNavigation()

            //tratar cookies
            let cookies = await page.cookies();
            let fileDir = `./cookies/${idFuncionario}/cookies.json`
            let dir = `./cookies/${idFuncionario}`
            if (!fs.existsSync(dir)) {
                //Efetua a criação do diretório
                fs.mkdirSync(dir);
                fs.writeFile(fileDir, JSON.stringify(cookies, null, 2));
            }

            try {

                fs.writeFileSync(fileDir, JSON.stringify(cookies, null, 2));

            } catch (error) {

                console.log("\r\n Erro ao gerar o cookie: ", error)

            }
            console.log("Cookies are ready");

            await page.waitForNavigation()

            const cookiesString = await fs.readFile(fileDir);
            cookies = JSON.parse(cookiesString);
            await page.setCookie(...cookies);
            console.log("\r\n Os Cookies foram gerados: ", cookies)

            await page.waitForNavigation()
            await browser.close();
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


const setupSession = async (page) => {
    return new Promise(async (resolve) => {


    })

}

module.exports = { auth };
