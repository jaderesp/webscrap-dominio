'use strict'
const app_ = require('../src/app'); /* diretorio do app para execução */
const socketCtr = require('../src/controllers/utils/socket');
const debug = require('debug')('balta:server'); /* debugar a aplicação */
const http = require('http'); /* criar servidor http */
const https = require('https');
var Spinnies = require("spinnies");
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();
const confEnv = process.env;

/* evitar error. issue: https://github.com/wppconnect-team/wppconnect/issues/485 */
process.setMaxListeners(0);

/* configurar socket.io */
var spinnies = new Spinnies();
let socket = {};
let serverSocket = {};

var Spinnies = require("spinnies");
const { builtinModules } = require('module');
const { work } = require("../src/worker/renewTokens")
const { panelAuthCookieGen } = require("../src/worker/generateCokies")

var app;

app_.then(async function (routes) {



    app = await routes;


    /* configurar servidor */
    let port = normalizePort(process.env.PORT || "82");

    let server = undefined;

    if (confEnv.HTTPS == 'false') {

        server = http.createServer(app); /* apontar a aplicação no novo servidor criado */

    } else {

        // Certificate
        const privateKey = fs.readFileSync('./ssl/private.key', 'utf8');
        const certificate = fs.readFileSync('./ssl/certificate.crt', 'utf8');
        // const ca = fs.readFileSync('./ssl/ca_bundle.crt', 'utf8');

        const credentials = {
            key: privateKey,
            cert: certificate,
            //ca: ca
        };

        port = normalizePort(process.env.SSL_PORT);
        server = https.createServer(credentials, app);

    }

    socket = require('socket.io')(server, {
        cors: {
            origin: '*',
        },
    });

    serverSocket = await socketCtr.inicialize(socket);

    //console.log("Socket io iniciado: ",serverSocket);   
    //iniciar serviços de atualização de token (painel dominio)
    panelAuthCookieGen()
    work()



    /* verificar funcionamento */
    server.listen(port);
    //console.log('Api Rodando na Porta:' + port);
    //var spinnies = new Spinnies();
    spinnies.add('server-screen', { text: '🚀 API iniciada na porta:' + port, color: 'yellow' });

    /* para verificar portas disponiveis e setar a porta a ser utilizada pelo servidor */
    function normalizePort(val) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }


    server.on('error', onError);
    /* tratar erros do servidor ou hospedagem - retornar qual tipo de erro */
    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof port === 'string' ?
            'Pipe' + port :
            'Port' + port;

        switch (error.code) {
            case 'EACCES':
                console.log(bind + ' requer elevação de privilégios.');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' esta em uso.');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /* exportar socketIo (ja configurado e em funcionamento) */
    exports.comunication = async function () {
        return new Promise(async (resolve, reject) => {
            console.log("Socket io iniciado: ", socket)
            resolve(socket);

        });

    };

    exports.socketCreated = async () => {
        return new Promise(async (resolve, reject) => {

            resolve(serverSocket);

        });

    }

}); /* fim do carregamento das rotas APP (index) */