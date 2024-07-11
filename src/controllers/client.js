const puppeteer = require('puppeteer-core');
//const { executablePath } = require('puppeteer')
//const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const config = require("../../config/browser")
const fs = require("fs")
const { removeDirectory } = require("./utils/filesUtils")
var fsp = require('fs/promises');
const dotenv = require('dotenv');
dotenv.config();
const funcionarioCtr = require("./../controllers/Funcionario_controller")
const { PORTAL_URL, FLAG_OS, WINDOWS_PATCH, LINUX_PATCH, LINUX_PATCH_CHROME } = process.env;
var sessions = []
//puppeteer.use(StealthPlugin());

//console.log(executablePath())

/* 
    usuario e senha do funcionario devera ser armazenado em banco de dados para resgate automatico (login da api)
    usando como parametros de identificação o cpf do funcionario
*/
const auth = async (idFuncionario, cacheOff) => {

    return new Promise(async (resolve) => {

        if (!idFuncionario) {
            console.log("\r\n idFuncionario não informado");
            resolve(false);
        }

        let { usuario_painel, senha_painel } = await funcionarioCtr.getSomeOne({ 'cpf': idFuncionario })

        if (!usuario_painel && senha_painel || usuario_painel && !senha_painel || !usuario_painel && !senha_painel) {

            console.log("\r\n Usuário e senha de acesso ao painel ausente, cancelando geração de token de acesso.")
            resolve(false)
        }

        if (cacheOff) {

            await cacheRemove(idFuncionario)

        }


        let launchOptions = {
            headless: true,
            USUARIODataDir: `./cache/${idFuncionario}`,
            executablePath: (FLAG_OS == 'windows') ? WINDOWS_PATCH : ((FLAG_OS == 'linux_chrome') ? LINUX_PATCH_CHROME : LINUX_PATCH),
            //executablePath: 'C:\\Program Files\\Google\\Chrome\\Application', //'/usr/bin/chromium-browser', // because we are using puppeteer-core so we must define this option
            // args: config.browser,
            args: ['--no-sandbox'],
            ignoreDefaultArgs: ["--disable-extensions"],
            slowMo: 100,
        };

        try {

            puppeteer.launch(launchOptions).then(async browser => {

                try {
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

                    //desabilitar o cache da pagina
                    /* await client.send('Network.setCacheDisabled', {
                         cacheDisabled: true,
                     }); */

                    await page.setJavaScriptEnabled(true);

                    await page.goto(PORTAL_URL, { waitUntil: "networkidle2", timeout: (60 * 1000 * 3) });

                    //await page.waitForNavigation()
                    await page.waitForSelector('body'); //aguardar todo carregamento da pagina
                    //await page.waitForNavigation(2000);
                    let logged = await verifyElementExist(page, '.header__username');

                    if (logged) {

                        await browser.close();
                        resolve(page);
                        return;
                    }

                    // await page.setViewport({ width: 734, height: 1024 });
                    //await page.$eval('#trauth-continue-signin-btn', form => form.click());
                    let foundElement = await verifyElementExist(page, 'input[name="username"]')

                    if (foundElement === false) {
                        await page.keyboard.press("Enter");
                    }
                    //printar tela
                    await page.screenshot({
                        path: 'screenshot.jpg'
                    });
                    await page.waitForSelector('input[name="username"]', { visible: true });
                    await page.type('input[name="username"]', usuario_painel);

                    //_button-login-id
                    // await page.$eval('._button-login-id', form => form.click());
                    foundElement = await verifyElementExist(page, 'input[id="password"]')

                    if (foundElement === false) {
                        await page.keyboard.press("Enter");
                    }

                    await page.screenshot({
                        path: 'screenshot.jpg'
                    });

                    await page.waitForSelector('input[id="password"]', { visible: true });
                    await page.type('input[id="password"]', senha_painel);

                    // await page.waitForNavigation(5000);

                    await page.keyboard.press("Enter");

                    //await page.screenshot({ path: `./teste.jpg` });
                    await page.waitForNavigation()

                    //tratar cookies
                    let cookies = await page.cookies();

                    await page.waitForSelector('body');
                    //aguardar itens da tela serem carregados para que o tokens (cookie) esteje disponível para acesso.
                    await page.waitForSelector(".menu-items");

                    //retornar dados do localStoage da pagina
                    let token = await page.evaluate(async () => {

                        var tk = await window.localStorage.getItem('onvio-uds-token')
                        localStorage.setItem("token", tk); //working
                        let { token } = localStorage
                        return token;
                        // return window.localStorage.getItem('onvio-uds-token')

                    })

                    if (token) {
                        cookies[1].value = token
                    }

                    let fileDir = `./cookies/${idFuncionario}/cookies.json`
                    let dir = `./cookies/${idFuncionario}`
                    if (!fs.existsSync(dir)) {
                        //Efetua a criação do diretório
                        fs.mkdirSync(dir);
                        await fsp.writeFile(fileDir, JSON.stringify(cookies, null, 2));
                    }

                    try {

                        fs.writeFileSync(fileDir, JSON.stringify(cookies, null, 2));

                    } catch (error) {

                        console.log("\r\n Erro ao gerar o cookie: ", error)

                    }
                    console.log("Cookies are ready");

                    // await page.waitForNavigation()

                    const cookiesString = await fsp.readFile(fileDir);
                    cookies = JSON.parse(cookiesString);
                    await page.setCookie(...cookies);
                    console.log("\r\n Os Cookies foram gerados: ", cookies)

                    let loggedIn = await page.waitForSelector('[href*=logout]', { timeout: 10000 }).catch(e => {

                    })

                    //await page.waitForNavigation()
                    await browser.close();
                    resolve(page);

                } catch (error) {

                    console.log("\r\nOcorreu um erro ao inicializar o painel:", error)
                    console.log("\r\nReinicializando...")

                    await browser.close();
                    await cacheRemove(idFuncionario)
                    auth(idFuncionario)

                }
            })

        } catch (error) {

            console.log("\r\nOcorreu um erro ao inicializar o browser: ", error)
            console.log("\r\nReinicializando...")
            await browser.close();
            await cacheRemove(idFuncionario)
            auth(idFuncionario)
            resolve(true)

        }
    })


}



const verifyElementExist = async (page, ident) => {
    return new Promise(async (resolve) => {

        if (!ident) {
            resolve(false)
            return;
        }

        try {

            /*    resolve(page.evaluate(async () => {
                    return await new Promise(resolve => {
                       
                        try {
                            let element = document.querySelector(`${ident}`)
                            let exist = (element) ? true : false
                            resolve(exist);
                        } catch (error) {
                            console.log("\r\nOcorreu um erro ao validar ao pesquisar elemento: ", error)
                            resolve(false)
                        }
                    })
                })) */

            resolve(await page.evaluate((ident_) => {
                let el = document.querySelector(`${ident_}`)
                return el ? true : false
            }, ident))

        } catch (error) {

            console.log("\r\nOcorreu um erro ao validar ao pesquisar elemento: ", error)
            resolve(false)

        }


    })
}


const cacheRemove = async (idFuncionario, type) => {
    return new Promise(async (resolve) => {

        if (!idFuncionario) {
            resolve(false)
            return
        }

        let cookieFile = `./cookies/${idFuncionario}/cookies.json`
        let cookieDir = `./cookies/${idFuncionario}`
        let cacheBrowserDir = `./cache/${idFuncionario}`

        //fs.rmSync(cookieDir, { recursive: true, force: true });
        //fs.rmSync(cacheBrowserDir, { recursive: true, force: true });

        await removeDirectory(cookieDir)
        await removeDirectory(cacheBrowserDir)

        /* fs.unlink(cookieFile, function (err) {
             if (err) return console.log(err);
             console.log('\r\nCache removido com sucesso!');
         }) */

        resolve(true)


    })
}

module.exports = { auth };
