'use strict'
const express = require('express'); /* criar app mvc */
var app = express();
const bodyParser = require('body-parser');
var session = require('express-session');
const router = express.Router(); /* navegação web pelos diretorio(link) da aplicação */
const { swaggerGen } = require("../../config/swagger");
var path = require('path');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();
let confEnv = process.env;

app.set('views', './src/views') /* localidade das views */
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

/* sessao */
/* sessao config */
app.use(session({
    name: 'wapi_conn',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

/* importar rotas */
const home = require('./front/home-route')
const acesso = require('./front/login-route')
const wapiRoute = require('./front/session-route')
const api = require('./api/index')

const rotas = async function () {
    return new Promise(async (resolve, reject) => {

        /* CORS */
        var allowlist = [confEnv.FRONT_URL, 'https://watszap.com.br']
        var corsOptions = {
            origin: allowlist,
            origin: true,
            optionsSuccessStatus: 200 // For legacy browser support
        }

        app.use(cors(corsOptions));

        /* adicionar body-parser no app, para que toda requisição o result seja convertido para formato json -automaticamente */
        app.use(bodyParser.json({ limit: '50mb' }));
        app.use(bodyParser.urlencoded({ /* solução para: Error: getaddrinfo EAI_AGAIN */
            extended: true,
            limit: "100000mb",
            parameterLimit: 10000000
        }));

        /* gerar rota documentação */
        app = await swaggerGen('/docs', app);


        /* liberar acesso requisições originada de endereços diferentes do dominio da aplicação
            ler mais: https://cursos.alura.com.br/forum/topico-requisicao-cross-origin-bloqueada-36630
        */
        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        /* gerar acesso a pasta public (visualizar arquivos front = imagens) */
        var dir = path.join(__dirname + '/../../', 'public');
        app.use(express.static(dir));

        /* chamadas http-pages - front */
        app.get('/', acesso.login);

        app.post('/inicialize', home.inicialize);
        /* login de usuario no sistema (front) */
        app.get('/login', acesso.login);
        app.post('/auth', acesso.auth);

        /* logoff session no front */
        app.post('/logoff', home.logoff);

        /* controle da sessão wapi no front */
        app.post('/destroy', wapiRoute.destroy);

        //rotas da apí
        app = await api.index(app)

        resolve(app);


    });

}


module.exports = { rotas };