const { Resolver } = require('dns');
const funcionarioCtr = require('../controllers/Funcionario_controller')
const client = require("../controllers/client")
const { listDirectories } = require("../controllers/utils/filesUtils")
const fs = require('fs');
const fsp = require('fs/promises');

let flagExec = false

module.exports.panelAuthCookieGen = async () => {


    console.log("\r\n== VERIFICANDO SE ACESSO DO FUNCIONARIOS POSSUI CACHE...")

    let funcionarios_list = await funcionarioCtr.get({})

    if (flagExec == true) {
        console.log("\r\n== VERIFICAÇÃO DE CACHE EM ANDAMENTO, AGUARDANDO FINALIZAÇÃO...")
    }

    for (var i = 0; i < funcionarios_list.length; i++) {

        funcionarios_list[i] = funcionarios_list[i].dataValues

        let { cpf, usuario_painel, senha_painel } = funcionarios_list[i]

        //veriricar se já foi gerado diretorio de cache
        let cacheExist = await verifyExistCache(cpf)

        //se não existir cache criado, então realizar primeiro acesso ao portal dominio para gerar o token de acesso (cookies)
        if (cacheExist == false && usuario_painel && senha_painel && flagExec == false) {

            flagExec = true
            console.log("\r\n== GERANDO ACESSO ATRAVÉS DO PRIMEIRO ACESSO AO PORTAL...")
            //gera autenticação via painel dominio (gerar cookies)
            await client.auth(cpf, false)

            console.log("\r\n== FINALIZANDO GERAÇÃO DE PRIMEIRO ACESSO (GERAR CACHE)...")

            flagExec = false

        }

    }

    console.log("\r\n== VERIFICAÇÃO DE CACHE DE ACESSO DE FUNCIONÁRIOS CONCLUIDA.")

    if (flagExec == false) {
        //ao finalizar a primeira execuçõ ao startar o servidor, executar novamente a cada x horas
        //executar uma vez a cada 12 horas
        let horas = "00"
        let minutos = "01"
        let segundos = "00"

        console.log(`\r\n== PROXIMA VERIFICAÇÃO AGENDADA PARA APÓS ${horas} Horas, ${minutos} minutos e ${segundos} segundos.`)

        setInterval(async () => {

            flagExec = true
            await this.panelAuthCookieGen()
            flagExec = false

            console.log(`\r\n== PROXIMA VERIFICAÇÃO AGENDADA PARA APÓS ${horas}:${minutos}:${segundos}.`)

        }, (parseInt(segundos) * 1000) + (parseInt(minutos) * 60000) + (parseInt(horas) * 60000 * 60));


    }

}


//verificar se existe diretorio (cache) já criado para o funcionario
const verifyExistCache = async (cpf_) => {

    return new Promise(async (resolve, reject) => {

        const directories = await listDirectories("./cookies");

        //listar id de funcionarios existentes (tokens criados (dir))
        if (directories.length > 0) {

            for (var i = 0; i < directories.length; i++) {

                let { name } = directories[i]

                if (cpf_ !== name) {
                    continue //pular registro (proximo)
                }

                let dir = `../cookies/${name}`

                if (fs.existsSync(dir)) {

                    resolve(true)

                } else {

                    resolve(false)

                }

            }

            resolve(false)

        } else {
            //nenhum diretorio de cache existente
            resolve(false)
        }

    })


}

