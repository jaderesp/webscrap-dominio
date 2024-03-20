const { accountData, folhaList, holerite } = require("../models/Folha_model");

module.exports.accountData = async (idFuncionario) => {

    return new Promise(async (resolve, reject) => {

        let accountData_ = await accountData(idFuncionario)

        resolve(accountData_)

    })

}

module.exports.folhaList = async (params) => {

    return new Promise(async (resolve, reject) => {

        let { accountId, idFuncionario } = params

        let accountData_ = await folhaList(accountId, idFuncionario)

        resolve(accountData_)

    })

}

module.exports.holerite = async (params) => {

    return new Promise(async (resolve, reject) => {

        let { fileId, accountId, idFuncionario } = params

        let accountData_ = await holerite(fileId, accountId, idFuncionario)

        resolve(accountData_)

    })

}