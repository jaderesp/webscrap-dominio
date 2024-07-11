
'use strict'
const { Sequelize } = require('sequelize');
const database = require('../../config/sequelize');

let Funcionarios = database.define('Funcionarios', {
    id_func: {
        type: Sequelize.INTEGER.ZEROFILL,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_conta: {
        type: Sequelize.INTEGER.ZEROFILL,
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    codigoEmpresa: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    registro: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    admissao: {
        type: Sequelize.DATE,
        allowNull: true
    },
    cargo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    salario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    situacao: {
        type: Sequelize.STRING,
        allowNull: false
    },
    empresa: {
        type: Sequelize.STRING,
        allowNull: true // Alguns registros não possuem a empresa
    },
    usuario_painel: {
        type: Sequelize.STRING,
        allowNull: true
    },
    senha_painel: {
        type: Sequelize.STRING,
        allowNull: true
    },
    // Timestamps
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
});

module.exports.sync = async () => {

    try {
        const resultado = await database.sync({ force: true });
        return resultado;
    } catch (error) {
        console.log(error);
        return false;
    }

}

module.exports.add = async (params) => {

    if (!params) {
        console.log("Erro, não existem dados de paramentros para esta tarefa.")
        return false;
    }

    try {
        const resultadoCreate = await Funcionarios.create(params);
        // console.log("Resultado criação de Funcionarios: ",resultadoCreate);

        return resultadoCreate;

    } catch (error) {
        console.log("Ocorreu um erro ao criar o Funcionarios: ", error);

        /* forçar criação da tabela caso não exista */
        let res = await Funcionarios.sync();

        if (res) {
            console.log("✅ Por precaução, Forçamos a criação da tabela de Funcionarios.", res);
        }

        return false;
    }

}

/* add or update */
module.exports.upsert = async (params, where) => {

    if (!params) {
        console.log("Erro, não existem dados de paramentros para esta tarefa.")
        return false;
    }

    try {
        let result = false;

        if (!where) {
            return false;
        }

        const foundItem = await Funcionarios.findOne({ where });
        if (!foundItem) {
            // Item not found, create a new one
            result = await Funcionarios.create(params)
            return result;
        }
        // Found an item, update it
        result = await Funcionarios.update(params, { where });

        return result;

    } catch (error) {
        console.log("Ocorreu um erro ao criar o Funcionarios: ", error);

        /* forçar criação da tabela caso não exista */
        let res = await Funcionarios.sync();

        if (res) {
            console.log("✅ Por precaução, Forçamos a criação da tabela de Funcionarios.", res);
        }

        return false;
    }

}


/* login de Funcionarios */
module.exports.getAll = async function () {

    return new Promise(async (resolve, reject) => {
        let retorno = false;

        try {

            let response = undefined;

            try {
                response = await Funcionarios.findAll({ order: [['updatedAt', 'DESC']] });
            } catch (error) {

                console.log("Ocorreu um erro ao efetuar consulta ao banco de dados: ", error);
                return false;

            }

            let dados = response;
            //console.log("ordem das mensagens: ", dados);
            resolve(dados); /* retornar login e dados da sessão */

        } catch (error) {
            resolve(false);
        }


    });


}


/* get Funcionarios */
module.exports.get = async function (where_) {

    return new Promise(async (resolve, reject) => {
        let retorno = false;

        try {

            if (!where_) {
                resolve(retorno);
            }

            let response = undefined;

            try {
                response = await Funcionarios.findAll({ where: where_ });
            } catch (error) {

                console.log("Ocorreu um erro ao efetuar consulta ao banco de dados: ", error);

            }

            let dados = response;

            resolve(dados);

        } catch (error) {
            console.log("Ocorreu um erro ao realizar a consulta de Funcionarios: ", error);
            resolve(false);
        }


    });


}

module.exports.getSomeOne = async function (where_) {

    return new Promise(async (resolve, reject) => {
        let retorno = false;

        try {

            if (!where_) {
                resolve(retorno);
            }

            let response = undefined;

            try {
                response = await Funcionarios.findAll({ where: where_ });
            } catch (error) {

                console.log("Ocorreu um erro ao efetuar consulta ao banco de dados: ", error);

            }

            let dados = [];

            if (response[0]) {
                dados = response[0].dataValues;
            }

            resolve(dados);

        } catch (error) {
            console.log("Ocorreu um erro ao realizar a consulta de contato: ", error);
            resolve(false);
        }


    });


}


/* remover */
module.exports.remove = async (where_) => {

    if (!where_) {
        console.log("Erro, é preciso informar parametros de seleçãodo registro para realizar exclusão do registro.")
        return false;
    }

    try {
        const resultado = await Funcionarios.destroy({
            where: where_
        });

        return resultado;

    } catch (error) {

        console.log("Ocorreu um erro ao atualizare o registro: ", error);

        return false;
    }

}