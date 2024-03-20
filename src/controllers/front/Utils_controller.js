'use strict'
const axios = require('axios')
const dotenv = require('dotenv');
dotenv.config();


const confEnv = process.env;
const base_url = process.env.baseUrl;


exports.postIn = async (route,params) => {    

    return new Promise( async (resolve, reject) => {
            /* chamar rota */
            let url = confEnv.baseUrl + route;

            console.log(url);
            let retorno = await axios.post(url, params)
            .then(res => {
                console.log(`statusCode: ${res.status}`);
                console.log(res.data);
                return res.data;
            })
            .catch(error => {
                console.error(error)
                return false;
            });


            if(retorno){

                resolve(retorno);

            }
           

        });
}

exports.baseUrl = base_url;