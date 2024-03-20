/* rotas para front home */
const home = require('../../controllers/front/Home_controller');
const util = require('../../controllers/front/Utils_controller');


/* paginas http-front */
module.exports.front = function (req, res) {

    /* inicializar valores na pagina */
    let data = { instancia: '', qrcode: '--', status: false };
    let log = { 'session': null }

    log.session = req.session.perfil;
    /* verificar se esta logado */
    if (log.session.login) {

        /* direcionar para pagina logado e passar os dados de login */
        return res.render('home/index', { 'usuario': log.session, 'dados': data, 'baseUrl': util.baseUrl });

    } else {
        /* retornar para login */
        return res.render('login/index', { dados: data, 'baseUrl': util.baseUrl });
    }


}


module.exports.inicialize = async (req, res) => {


    let retorno = false;

    /* verificar se esta logado */
    if (req.session.perfil) {

        retorno = await home.inicialize(req, res);

    } else {
        /* retornar para login */
        return res.render('login/index', { 'baseUrl': util.baseUrl });
    }

    return retorno;

}

module.exports.logoff = async (req, res) => {

    let retorno = false;


    retorno = await home.logoff(req, res);


    return retorno;

}