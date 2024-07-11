const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const client = require("../controllers/client")
const { listDirectories } = require("../controllers/utils/filesUtils")
const { validateTimestamp } = require("../controllers/utils/datesUtils")


// Configura um intervalo de verificação a cada segundo
var servico;
var flagExec = false
console.log("\r\n== INICIANDO SERVIÇO DE GERENCIAMENTO DE TOKENS DE ACESSO DE FUNCIONÁRIOS. ==")
const onOff = async (action) => {

    return new Promise(async (resolve, reject) => {

        if (action === 'start') {

            servico = setInterval(this.work, 10000);
            resolve(true)

        } else if (action === 'stop') {

            clearInterval(servico)
            resolve(false)

        }

    })

}

module.exports.work = async () => {


    const directories = await listDirectories("./cookies");

    //listar id de funcionarios existentes (tokens criados (dir))
    if (directories.length > 0) {

        for (var i = 0; i < directories.length; i++) {

            if (flagExec == true) {
                return
            }

            let { name } = directories[i]
            let cookie = []
            let cookiesString = {}
            let dir = `../cookies/${name}`

            if (!fs.existsSync(dir)) {

                try {

                    cookiesString = await fsp.readFile(`./cookies/${name}/cookies.json`);
                    cookie = JSON.parse(cookiesString);

                } catch (error) {
                    console.log("\r\nOcorreu um erro ao ler o cookie (json): ", error)
                    console.log("\r\n=== NÃO EXISTE ARQUIVO DE TOKEN PARA RESTE FUNCIONARIO, SOLICITANDO NOVO TOKEN...")
                    flagExec = true
                    await onOff('stop')
                    let idFuncionario = name
                    await client.auth(idFuncionario)
                    await onOff('start')
                    flagExec = false
                    continue
                }

                if (cookie.length > 0) {
                    //verificar a data de exiração
                    let { value, expires } = cookie[1]
                    let formated = (expires.toString().indexOf(".") !== -1) ? (parseFloat((expires).toString().split(".")[0])) : expires
                    let expired = await validateTimestamp(formated)

                    //se a data e hora for atingida (validar o token)
                    if (expired) { //se tiver expirado gerar novo token

                        console.log("\r\n== TOKEN DE ACESSO DO FUNCIONÁRIO EXPIRADO, ATUALIZANDO...")
                        flagExec = true
                        await onOff('start')
                        //atualizar o token e remover
                        let idFuncionario = name
                        await client.auth(idFuncionario, true)
                        await onOff('start')

                        console.log("\r\n== TOKEN DE ACESSO DO FUNCIONÁRIO FOI ATUALIZADO.")
                        flagExec = false
                        continue
                        //verificar se irá ou não gerenciar fila de processos (threads)

                    } else {
                        //não fazer nada (ir para proximo registro)
                        console.log("\r\n== TOKEN DE ACESSO DO FUNCIONÁRIO AINDA ESTÁ NO PRAZO.")
                        continue
                    }


                } else {
                    continue
                }

            } else {
                console.log("\r\n== PASTA DE TOKEN DO FUNCIONARIO NÃO FOI CRIADA.")
                continue
            }


            //validar data

            //chamar autenticação (renovar token)


        }

    } else {
        //não existe nenhum diretorio de credenciais de funcionarios (aguardar a criação para realizar renovações de funcionarios já criados)
        console.log("\r\n== NÃO FOI CRIADA NENHUM DIRETÓRIO DE TOKEN DO FUNCIONARIO (AGUARDAR CRIAÇÃO VIA ROTA - FOLHA OU SERVIÇO AUTOMÁTICO DO SISTEMA).")

    }


}


servico = setInterval(this.work, 10000);
