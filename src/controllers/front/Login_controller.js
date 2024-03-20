'use strict'

const util = require('../front/Utils_controller')
const base_url = util.baseUrl;

/* autenticação do usuario */
exports.login = async function (senha) {

    return new Promise(async (resolve, reject) => {

        let params = { 'senha': senha, 'baseUrl': base_url };

        resolve(params);

    });

}