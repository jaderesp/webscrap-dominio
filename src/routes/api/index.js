const { start, accountData, folhaList, holerite } = require('./folha-route');

const index = async (app) => {

    return new Promise(async (resolve, reject) => {

        app.post('/folha', start);

        app.post('/conta', accountData);
        app.post('/folha/list', folhaList);
        app.post('/folha/holerite', holerite);

        resolve(app)

    })
};

module.exports = { index };