const { accountData, folhaList, holerite, feriasRecTypes, feriasList, feriasRecibo, rescisaoList, rescisaoComprovante } = require("../models/Folha_model");

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

module.exports.holeriteDirect = async (params) => {

    return new Promise(async (resolve, reject) => {

        let { mesAnoRef, idFuncionario } = params
        let accountId = undefined
        let fileId = undefined
        let retorno = {}

        if (!idFuncionario) {
            resolve({ "retorno": false, "msg": `Necessários informar o cpf do funcionário.` })
            return
        }

        if (!mesAnoRef) {
            resolve({ "retorno": false, "msg": `Necessários informar o mes e ano de referência.` })
            return
        }

        //dados da conta
        let accountData_ = await accountData(idFuncionario)

        if (Array.isArray(accountData_)) {
            // acccountId
            let { linkedAccountId } = accountData_[0]
            accountId = (linkedAccountId) ? linkedAccountId : undefined

        } else {

            resolve({ "retorno": false, "msg": `Identificação do funcionário informado, não foi encontrada.` })
            return

        }

        //listar holerites (arrayObjct)
        let folhaList_ = await folhaList(accountId, idFuncionario)

        let { items } = folhaList_

        if (Array.isArray(items)) {

            let holefSelected = items.filter((item) => {
                return item.basis == mesAnoRef
            })

            if (holefSelected.length > 0) {

                let { payslipDocumentId } = holefSelected[0]

                fileId = (payslipDocumentId) ? payslipDocumentId : undefined
            }

        }


        if (accountId && fileId) {

            //gerar holerite pdf
            retorno = await holerite(fileId, accountId, idFuncionario)

        } else {

            retorno = { "retorno": false, "msg": `Nenhum arquivo encontrado referente à ${mesAnoRef}` }
        }

        resolve(retorno)

    })

}

module.exports.feriasReciboDirect = async (params) => {

    return new Promise(async (resolve, reject) => {

        let { mesAnoRef, idFuncionario } = params
        let accountId = undefined
        let fileId = undefined
        let retorno = {}

        if (!idFuncionario) {
            resolve({ "retorno": false, "msg": `Necessários inormar o cpf do funcionário.` })
            return
        }

        if (!mesAnoRef) {
            resolve({ "retorno": false, "msg": `Necessários informar o mes e ano de referência.` })
            return
        }

        //dados da conta
        let accountData_ = await accountData(idFuncionario)

        if (Array.isArray(accountData_)) {
            // acccountId
            let { linkedAccountId } = accountData_[0]
            accountId = (linkedAccountId) ? linkedAccountId : undefined

        } else {

            resolve({ "retorno": false, "msg": `Identificação do funcionário informado, não foi encontrada.` })
            return

        }

        //listar holerites (arrayObjct)
        let feriasList_ = await feriasList(accountId, idFuncionario)

        let { items } = feriasList_

        if (Array.isArray(items)) {

            let holefSelected = items.filter((item) => {
                let data = item.basis
                data = data.substr((data.length) * -1, 7)
                return data == mesAnoRef
            })

            if (holefSelected.length > 0) {

                let { vacationDocumentId } = holefSelected[0]

                fileId = (vacationDocumentId) ? vacationDocumentId : undefined
            }

        }


        if (accountId && fileId) {

            //gerar holerite pdf
            retorno = await feriasRecibo(fileId, accountId, idFuncionario)

        } else {

            retorno = { "retorno": false, "msg": `Nenhum arquivo encontrado referente à ${mesAnoRef}` }
        }

        resolve(retorno)

    })

}


module.exports.rescisaoComprovanteDirect = async (params) => {

    return new Promise(async (resolve, reject) => {

        let { mesAnoRef, idFuncionario } = params
        let accountId = undefined
        let fileId = undefined
        let retorno = {}

        if (!idFuncionario) {
            resolve({ "retorno": false, "msg": `Necessários inormar o cpf do funcionário.` })
            return
        }

        if (!mesAnoRef) {
            resolve({ "retorno": false, "msg": `Necessários informar o mes e ano de referência.` })
            return
        }

        //dados da conta
        let accountData_ = await accountData(idFuncionario)

        if (Array.isArray(accountData_)) {
            // acccountId
            let { linkedAccountId } = accountData_[0]
            accountId = (linkedAccountId) ? linkedAccountId : undefined

        } else {

            resolve({ "retorno": false, "msg": `Identificação do funcionário informado, não foi encontrada.` })
            return

        }

        //listar holerites (arrayObjct)
        let rescisaoList_ = await rescisaoList(accountId, idFuncionario)

        let { items } = rescisaoList_

        if (Array.isArray(items)) {

            let rescisaoSelected = items.filter((item) => {
                let data = item.terminationDate
                data = data.substr((data.length) * -1, 7)
                return data == mesAnoRef
            })

            if (rescisaoSelected.length > 0) {

                let { terminationDocumentId } = rescisaoSelected[0]

                fileId = (terminationDocumentId) ? terminationDocumentId : undefined
            }

        }


        if (accountId && fileId) {

            //gerar holerite pdf
            retorno = await rescisaoComprovante(fileId, accountId, idFuncionario)

        } else {

            retorno = { "retorno": false, "msg": `Nenhum arquivo encontrado referente à ${mesAnoRef}` }
        }

        resolve(retorno)

    })

}