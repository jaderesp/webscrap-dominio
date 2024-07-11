'use strict'
const funcionarioMod = require('../models/Funcionario_model');
const extend = require('extend');
var fs = require('fs');
var mime = require('mime-types');
const iconv = require('iconv-lite');

module.exports.get = async (where) => {

    return new Promise(async (resolve, reject) => {

        let retorno = await funcionarioMod.get(where);

        resolve(retorno);

    });
}

module.exports.getSomeOne = async (where) => {

    return new Promise(async (resolve, reject) => {

        let retorno = await funcionarioMod.getSomeOne(where);

        resolve(retorno);

    });
}


module.exports.getAll = async (where) => {

    return new Promise(async (resolve, reject) => {

        let retorno = false;

        retorno = await funcionarioMod.get(where);

        resolve(retorno);

    })

}

module.exports.add = async (intent) => {

    return new Promise(async (resolve, reject) => {

        let retorno = await funcionarioMod.add(intent);

        resolve(retorno);

    });
}

module.exports.setup = async (intent, where) => {

    return new Promise(async (resolve, reject) => {

        let retorno = await funcionarioMod.upsert(intent, where);

        resolve(retorno);

    });
}


module.exports.remove = async (where) => {

    return new Promise(async (resolve, reject) => {

        let retorno = await funcionarioMod.remove(where);

        resolve(retorno);

    });
}
