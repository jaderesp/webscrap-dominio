const axios = require('axios');
const fs = require("fs");
let token;
//console.log(cookies[1])

const accountData = async (idFuncionario) => {

    return new Promise(async (resolve, reject) => {

        const cookiesString = fs.readFileSync(`./cookies/${idFuncionario}/cookies.json`);
        const cookies = JSON.parse(cookiesString);

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
                'Authorization': `UDSLongToken ${value}`
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


    })


}


const folhaList = async (accountId, idFuncionario) => {

    return new Promise(async (resolve, reject) => {

        const cookiesString = fs.readFileSync(`./cookies/${idFuncionario}/cookies.json`);
        const cookies = JSON.parse(cookiesString);

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

        const cookiesString = fs.readFileSync(`./cookies/${idFuncionario}/cookies.json`);
        const cookies = JSON.parse(cookiesString);

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

                    resolve({ "pdf": `files/holerites/${idFuncionario}/${fileId}.pdf` })
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

module.exports = { accountData, folhaList, holerite }