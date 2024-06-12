
const moment = require('moment');

const validateTimestamp = (timestamp) => {

    return new Promise(async (resolve, reject) => {

        // Converte o timestamp fornecido em uma data
        const eventDate = new Date(timestamp * 1000);  //converter timstamp UNixpara data legivel

        // Obtém a data e hora atual
        const currentDate = new Date();

        // Compara as datas
        resolve(eventDate < currentDate)

    })
};


module.exports = { validateTimestamp }