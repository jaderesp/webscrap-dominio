/* rotas para front home */
const session = require('../../controllers/front/Session_controller');


module.exports.destroy = async (req, res) => {

    let retorno = false;

      
    retorno = await session.destroy(req, res);


    return retorno;

}