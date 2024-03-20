'use strict'
let loginCtr = require('../../controllers/front/Login_controller');
const util = require('../../controllers/front/Utils_controller');
const base_url = util.baseUrl;

/* exibir pagina de login */
/* paginas http-front */
exports.login = function(req,res){
    
    console.log("rota login acionada...")
    /* inicializar valores na pagina */
    let data = {instancia:'',qrcode:'----',status:false};
    let log = {};
    log.session = req.session.perfil;

    /* verificar se esta logado */
    if(log.session){
        
         return res.render('home/index',{'usuario':log.session, 'dados':data,'baseUrl':base_url});
      
    }else{

        return res.render('login/index',{'baseUrl':base_url});

    }
  
}


exports.auth = async (req,res) => {

    let params = req.body;
    let retorno = false;
     /* inicializar valores na pagina */
     let data = {instancia:'',qrcode:'',status:false};
    retorno = await loginCtr.login(params);
    


    if(retorno !== false){

        if(retorno.login == true){

            req.session.perfil = retorno; /* dados recuperados do banco */
           
            /* redirecionar para home */
            res.render('home/index',{'usuario':req.session.perfil, 'dados':data,'baseUrl':base_url});
            //res.redirect('/login');
           

        }else{
            /** errono login */
            res.render('login/index',{'baseUrl':base_url}); /* retornar para login */
        }

    }else{
       
        /** errono login */
        res.render('login/index',{'baseUrl':base_url}); /* retornar para login */

    }


}