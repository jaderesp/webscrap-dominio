

const validateTimestamp = (timestamp) => {

    return new Promise(async (resolve, reject) => {

        const currentTime = Date.now(); // Obtém a data e hora atual em milissegundos
        const targetTime = new Date(timestamp).getTime(); // Converte o timestamp para milissegundos

        if (isNaN(targetTime)) {
            throw new Error('Invalid timestamp'); // Lança um erro se o timestamp não for válido           
        }

        resolve(currentTime >= targetTime); // Retorna true se a data e hora já foram atingidas, caso contrário false

    })
};


modules.exports = { validateTimestamp }