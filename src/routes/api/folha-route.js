const { auth } = require("../../controllers/client")
const { selectMenu, objFolhaPagto } = require("../../controllers/Painel_controller")
const folheCtr = require("../../controllers/Folha_controller")

const start = async (req, res) => {

    return new Promise(async (resolve, reject) => {

        const { cpf, type } = req.body

        let page = await auth(cpf)

        //clicar no menu desejado e fazer download do arquivo conforme referencia
        page = await selectMenu(page, type)

        let objFolhaData = await objFolhaPagto(page, "download", "02/2024")

        console.log(objFolhaData)
        resolve(res.status(200).send(objFolhaData))

    })
}

const accountData = async (req, res) => {

    return new Promise(async (resolve, reject) => {

        const { cpf, type } = req.body

        let accountData = await folheCtr.accountData(cpf)

        resolve(res.status(200).send(accountData))

    })
}

const folhaList = async (req, res) => {

    return new Promise(async (resolve, reject) => {

        const params = req.body

        let accountData = await folheCtr.folhaList(params)

        resolve(res.status(200).send(accountData))

    })
}

const holerite = async (req, res) => {

    return new Promise(async (resolve, reject) => {

        const params = req.body

        let accountData = await folheCtr.holerite(params)

        resolve(res.status(200).send(accountData))

    })
}


module.exports = { start, accountData, folhaList, holerite }
