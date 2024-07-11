const { start, accountData, folhaList, holerite, holeriteDirect, feriasReciboDirect, rescisaoComprovanteDirect } = require('./folha-route');

const index = async (app) => {

    return new Promise(async (resolve, reject) => {

        app.post('/folha', start);

        app.post('/conta', accountData);
        app.post('/folha/list', folhaList);
        app.post('/folha/holeriteByInfo', holerite);
        app.post('/folha/holerite', holeriteDirect);
        //comprovante de ferias
        app.post('/folha/ferias', feriasReciboDirect);
        //rescisão
        app.post('/folha/rescisao', rescisaoComprovanteDirect);

        resolve(app)

    })
};

module.exports = { index };