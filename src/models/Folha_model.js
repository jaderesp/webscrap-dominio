const axios = require('axios');
const fs = require("fs");
let token;
const client = require("../controllers/client")

const dotenv = require('dotenv');
dotenv.config();
const { baseURL } = process.env;
//console.log(cookies[1])

const accountData = async (idFuncionario) => {

    return new Promise(async (resolve, reject) => {

        try {
            let fileExist = (fs.existsSync(`./cookies/${idFuncionario}/cookies.json`))

            if (!fileExist) {
                console.log("\r\n Arquivo de cookies não encontrado, realizar login (gerar novas credenciais).")
                resolve(false)
            }

        } catch (error) {

            console.log("\r\n Erro ao pesquisar o Arquivo de cookies, realizar login na api para gerar novas credenciais (token).")
            resolve(false)

        }


        let cookies = {}

        try {
            const cookiesString = fs.readFileSync(`./cookies/${idFuncionario}/cookies.json`);
            cookies = JSON.parse(cookiesString);

            if (cookies.length == 0) {

                console.log | ("\r\nO arquivo de tokens não possui token do funcionario: ", error)
                resolve(false)

            }

            let { value } = cookies[1]

            if (!value) {
                console.log("\r\n Tokens (cookies) não encontrado!")
                resolve(false)
            }

            token = value

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'https://onvio.com.br/api/profiles/v1/accounts?active=true&hideNonOnvio=false',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Authorization': `UDSLongToken ${token}`
                }
            };

            try {

                axios.request(config)
                    .then((response) => {
                        // console.log(JSON.stringify(response.data));

                        resolve(response.data)
                    })
                    .catch((error) => {
                        console.log("\r\n Ocorreu um erro ao realizar a requisição http: ", error);
                        resolve(false)
                    });

            } catch (error) {

                console.log | ("\r\nOcorreu um erro ao executar a função: ", error)
                resolve(false)

            }


        } catch (error) {

            console.log | ("\r\nOcorreu ao consultar arquivo de tokens do funcionario: ", error)
            resolve(false)

        }



    })


}


const folhaList = async (accountId, idFuncionario) => {

    return new Promise(async (resolve, reject) => {

        let cookiesString = ""
        let cookies = {}

        try {

            cookiesString = fs.readFileSync(`./cookies/${idFuncionario}/cookies.json`);

            cookies = JSON.parse(cookiesString);

        } catch (error) {
            resolve({ "resultado": false, "erro": error.toString() })
            return;
        }



        let { value } = cookies[1]

        if (!value) {
            console.log("\r\n Tokens (cookies) não encontrado!")
            resolve(false)
        }

        token = value

        if (!accountId) {
            console.log("\r\nO id da conta não foi informado!")
            resolve(false)
        }

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://onvio.com.br/api/br-employee-portal/v1/payslip?pageIndex=0&linkedAccountId=${accountId}`,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': `UDSLongToken ${token}`
            }
        };

        try {

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));

                    resolve(response.data)
                })
                .catch((error) => {
                    console.log(error);
                    resolve(false)
                });

        } catch (error) {

            console.log | ("\r\nOcorreu um erro ao executar a função: ", error)
            resolve(false)

        }

    })


}


const holerite = async (fileId, accountId, idFuncionario) => {

    return new Promise(async (resolve, reject) => {

        let cookiesString = ""
        let cookies = {}

        try {

            cookiesString = fs.readFileSync(`./cookies/${idFuncionario}/cookies.json`);

            cookies = JSON.parse(cookiesString);

        } catch (error) {
            resolve({ "resultado": false, "erro": error.toString() })
            return;
        }

        let { value } = cookies[1]

        if (!value) {
            console.log("\r\n Tokens (cookies) não encontrado!")
            resolve(false)
        }

        token = value

        if (!fileId) {
            console.log("\r\nO id do arquivo não foi informado!")
            resolve(false)
        }

        if (!accountId) {
            console.log("\r\nO id da conta não foi informado!")
            resolve(false)
        }

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://onvio.com.br/api/br-employee-portal/v1/payslip/${fileId}/doc?linkedAccountId=${accountId}`,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': `UDSLongToken ${token}`
            },
            responseType: 'stream'
        };

        try {

            const writer = fs.createWriteStream(`./public/files/holerites/${idFuncionario}/${fileId}.pdf`);
            axios.request(config)
                .then((response) => {

                    response.data.pipe(writer);

                    resolve({ "pdf": `${baseURL}/files/holerites/${idFuncionario}/${fileId}.pdf` })
                })
                .catch((error) => {
                    console.log("\r\n Ocorreu um erro ao realizar download do holerite: ", error);
                    resolve(false)
                });

        } catch (error) {

            console.log | ("\r\nOcorreu um erro ao executar a função: ", error)
            resolve({ "retorno": false })

        }

    })


}


const feriasRecTypes = async (idFuncionario) => {

    return new Promise(async (resolve, reject) => {

        let cookiesString = ""
        let cookies = {}

        try {

            cookiesString = fs.readFileSync(`./cookies/${idFuncionario}/cookies.json`);

            cookies = JSON.parse(cookiesString);

        } catch (error) {
            resolve({ "resultado": false, "erro": error.toString() })
            return;
        }

        let { value } = cookies[1]

        if (!value) {
            console.log("\r\n Tokens (cookies) não encontrado!")
            resolve(false)
        }

        token = value

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://onvio.com.br/api/br-employee-portal/v1/vacation/types?lang=pt`,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': `UDSLongToken ${token}`
            }
        };

        try {


            axios.request(config)
                .then((response) => {

                    console.log("\r\nDados de tipos de recibos de ferias: ", JSON.stringify(response.data));

                    resolve(response.data)
                })
                .catch((error) => {
                    console.log("\r\n Ocorreu um erro ao realizar download do holerite: ", error);
                    resolve(false)
                });

        } catch (error) {

            console.log | ("\r\nOcorreu um erro ao executar a função: ", error)
            resolve({ "retorno": false })

        }

    })


}

const feriasList = async (accountId, idFuncionario) => {

    return new Promise(async (resolve, reject) => {

        let cookiesString = ""
        let cookies = {}

        try {

            cookiesString = fs.readFileSync(`./cookies/${idFuncionario}/cookies.json`);

            cookies = JSON.parse(cookiesString);

        } catch (error) {
            resolve({ "resultado": false, "erro": error.toString() })
            return;
        }



        let { value } = cookies[1]

        if (!value) {
            console.log("\r\n Tokens (cookies) não encontrado!")
            resolve(false)
        }

        token = value

        if (!accountId) {
            console.log("\r\nO id da conta não foi informado!")
            resolve(false)
        }

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://onvio.com.br/api/br-employee-portal/v1/vacation?pageIndex=0&linkedAccountId=${accountId}`,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': `UDSLongToken ${token}`
            }
        };

        try {

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));

                    resolve(response.data)
                })
                .catch((error) => {
                    console.log(error);
                    resolve(false)
                });

        } catch (error) {

            console.log | ("\r\nOcorreu um erro ao executar a função: ", error)
            resolve(false)

        }

    })


}

const feriasRecibo = async (fileId, accountId, idFuncionario) => {

    return new Promise(async (resolve, reject) => {

        let cookiesString = ""
        let cookies = {}

        try {

            cookiesString = fs.readFileSync(`./cookies/${idFuncionario}/cookies.json`);

            cookies = JSON.parse(cookiesString);

        } catch (error) {
            resolve({ "resultado": false, "erro": error.toString() })
            return;
        }

        let { value } = cookies[1]

        if (!value) {
            console.log("\r\n Tokens (cookies) não encontrado!")
            resolve(false)
        }

        token = value

        if (!fileId) {
            console.log("\r\nO id do arquivo não foi informado!")
            resolve(false)
        }

        if (!accountId) {
            console.log("\r\nO id da conta não foi informado!")
            resolve(false)
        }

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://onvio.com.br/api/br-employee-portal/v1/vacation/${fileId}/doc?linkedAccountId=${accountId}`,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': `UDSLongToken ${token}`
            },
            responseType: 'stream'
        };

        try {

            let fileDir = `./public/files/ferias/${idFuncionario}/${fileId}.pdf`
            let dir = `./public/files/ferias/${idFuncionario}`

            try {

                if (!fs.existsSync(dir)) {

                    fs.mkdirSync(dir);
                    console.log(`Diretório ${fileDir} criado com sucesso.`);

                } else {
                    console.log(`\r\n O diretório ${dir} já existe.`);
                    //continuar
                }

            } catch (error) {
                console.log(`\r\n Ocorreu erro ao criar o diretório ${dir}.`, error);
                resolve(false)
            }

            const writer = fs.createWriteStream(fileDir);
            axios.request(config)
                .then((response) => {

                    response.data.pipe(writer);

                    resolve({ "pdf": `${baseURL}/files/ferias/${idFuncionario}/${fileId}.pdf` })
                })
                .catch((error) => {
                    console.log("\r\n Ocorreu um erro ao realizar download do holerite: ", error);
                    resolve(false)
                });

        } catch (error) {

            console.log | ("\r\nOcorreu um erro ao executar a função: ", error)
            resolve({ "retorno": false })

        }

    })


}

//comprovantes  rescisão
const rescisaoList = async (accountId, idFuncionario) => {

    return new Promise(async (resolve, reject) => {

        let cookiesString = ""
        let cookies = {}

        try {

            cookiesString = fs.readFileSync(`./cookies/${idFuncionario}/cookies.json`);

            cookies = JSON.parse(cookiesString);

        } catch (error) {
            resolve({ "resultado": false, "erro": error.toString() })
            return;
        }



        let { value } = cookies[1]

        if (!value) {
            console.log("\r\n Tokens (cookies) não encontrado!")
            resolve(false)
        }

        token = value

        if (!accountId) {
            console.log("\r\nO id da conta não foi informado!")
            resolve(false)
        }

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://onvio.com.br/api/br-employee-portal/v1/termination?pageIndex=0&linkedAccountId=${accountId}`,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': `UDSLongToken ${token}`
            }
        };

        try {

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));

                    resolve(response.data)
                })
                .catch((error) => {
                    console.log(error);
                    resolve(false)
                });

        } catch (error) {

            console.log | ("\r\nOcorreu um erro ao executar a função: ", error)
            resolve(false)

        }

    })


}

const rescisaoComprovante = async (fileId, accountId, idFuncionario) => {

    return new Promise(async (resolve, reject) => {

        let cookiesString = ""
        let cookies = {}

        try {

            cookiesString = fs.readFileSync(`./cookies/${idFuncionario}/cookies.json`);

            cookies = JSON.parse(cookiesString);

        } catch (error) {
            resolve({ "resultado": false, "erro": error.toString() })
            return;
        }

        let { value } = cookies[1]

        if (!value) {
            console.log("\r\n Tokens (cookies) não encontrado!")
            resolve(false)
        }

        token = value

        if (!fileId) {
            console.log("\r\nO id do arquivo não foi informado!")
            resolve(false)
        }

        if (!accountId) {
            console.log("\r\nO id da conta não foi informado!")
            resolve(false)
        }

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://onvio.com.br/api/br-employee-portal/v1/termination/${fileId}/doc?linkedAccountId=${accountId}`,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': `UDSLongToken ${token}`
            },
            responseType: 'stream'
        };

        try {

            let fileDir = `./public/files/rescisao/${idFuncionario}/${fileId}.pdf`
            let dir = `./public/files/rescisao/${idFuncionario}`

            try {

                if (!fs.existsSync(dir)) {

                    fs.mkdirSync(dir);
                    console.log(`Diretório ${fileDir} criado com sucesso.`);

                } else {
                    console.log(`\r\n O diretório ${dir} já existe.`);
                    resolve(false)
                }

            } catch (error) {
                console.log(`\r\n Ocorreu erro ao criar o diretório ${dir}.`, error);
                resolve(false)
            }

            const writer = fs.createWriteStream(fileDir);
            axios.request(config)
                .then((response) => {

                    response.data.pipe(writer);

                    resolve({ "pdf": `${baseURL}/files/rescisao/${idFuncionario}/${fileId}.pdf` })
                })
                .catch((error) => {
                    console.log("\r\n Ocorreu um erro ao realizar download do holerite: ", error);
                    resolve(false)
                });

        } catch (error) {

            console.log | ("\r\nOcorreu um erro ao executar a função: ", error)
            resolve({ "retorno": false })

        }

    })


}

module.exports = { accountData, folhaList, holerite, feriasRecTypes, feriasList, feriasRecibo, rescisaoList, rescisaoComprovante }

