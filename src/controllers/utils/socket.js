'use strict'
var Spinnies = require("spinnies");
//const whatsapp = require('../../routes/wp-route');
const { parse, stringify } = require('flatted');
const extend = require('extend');
/* chamar router/funcoes responsáveis por retornar notificações */


/* configurar socket.io */
var spinnies = new Spinnies();


/* classe para chamada do socket nomeada pela identificação de cada sessão (cliente) */
exports.inicialize = async (socket) => {

    return new Promise(async (resolve, reject) => {


        socket.on('connection', async (socket) => {

            spinnies.add('server-screen-socket', { text: 'Sistema de notificações, foi requisitando pelo cliente id: ' + socket.id + ' rodando...', color: 'red' });

            socket.on('error', function (e) {

                console.log(' Ocorreu um erro ao enviar dados via socket: ' + e);
                return;
            });

            /* chamada do cliente para api  -  Cliente ----> API */
            socket.on('getNotification', async data => {

                var sessions_list = await JSON.parse(data);



            });


            /* desconectar-se */
            socket.on('disconnect', () => {
                console.log('disconnected from user');
            });



        });




        resolve(socket);

    });



}



/* enviar dados para o client socketio */
exports.send = async (socket, nameCall, params) => {

    return new Promise(async (resolve, reject) => {

        if (!socket) {
            resolve(false);
        }

        if (!params) {
            resolve(false);
        }

        if (!nameCall) {
            resolve(false);
        }

        let pars = JSON.stringify(params, getCircularReplacer());

        let res;

        try {

            res = socket.emit(nameCall, pars);

        } catch (error) {

            console.log("\r\nErro ao realizar comunicação via socket: ", error);
            resolve(false);
            return;

        }

        if (res) {
            resolve(true);
        }

    })

}

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};