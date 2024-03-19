const { auth } = require("./controller/client")
const { selectMenu, objFolhaPagto } = require("./controller/Painel_controller")

const start = async () => {


    let page = await auth()

    //clicar no menu desejado e fazer download do arquivo conforme referencia
    page = await selectMenu(page, "Folhas de Pagamento")

    let objFolhaData = await objFolhaPagto(page, "download", "02/2024")

    console.log(objFolhaData)


}


start()