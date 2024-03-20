/* 
    Autor: Jader Espírito Santo Silva
    data: 01/11/2021
    Whatsapp: (16) 99714-1457
    Finalidade: fornecer funçãoes para o fronte para executar rotas da api, e views do front.

*/


const util = require('../front/Utils_controller');

/* destruir a sessão whatsapp */
module.exports.destroy = async (req, res) => {

    let params = req.body

    if(!params.instancia){
        return false;
    }

    let retorno = false;

          /* verificar se esta logado */
    if(req.session.perfil){        

        retorno = await util.postIn('/wp/logoff',params);
         /* chamar a page destino e enviar os dados */
        res.render('home/index',{'usuario':req.session.perfil,'dados':retorno,'baseUrl':util.baseUrl});

    }else{
        /* retornar para login */
        res.render('login/index');
    } 

   

}