const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const client = require("../controllers/client")
const { listDirectories } = require("../controllers/utils/filesUtils")
const { validateTimestamp } = require("../controllers/utils/datesUtils")


const work = async () => {

    const directories = await listDirectories("./cookies");

    //listar id de funcionarios existentes (tokens criados (dir))
    if (directories.length > 0) {

        for (var i = 0; i < directories.length; i++) {

            let { name } = directories[i]
            let cookie = []
            let cookiesString = {}
            let dir = `./cookies/${name}`

            if (!fs.existsSync(dir)) {

                cookiesString = await fsp.readFile(fileDir);
                cookie = JSON.parse(cookiesString);

                if (cookie.length > 0) {
                    //verificar a data de exiração
                    let { value, expires } = cookie[1]

                    let expired = await validateTimestamp(expires)

                    //se a data e hora for atingida (validar o token)
                    if (expired) {
                        //atualizar o token e remover
                        let idFuncionario = name
                        await client.auth(idFuncionario)

                        //verificar se irá ou não gerenciar fila de processos (threads)

                    }


                } else {
                    continue
                }

            } else {
                continue
            }


            //validar data

            //chamar autenticação (renovar token)


        }

    }


}


modules.exports = { work }