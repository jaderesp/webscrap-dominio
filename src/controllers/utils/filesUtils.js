const fs = require('fs-extra');
const path = require('path');

const removeDirectory = async (dirPath) => {
    return new Promise(async (resolve, reject) => {
        try {

            const dirToRemove = path.join(__dirname, dirPath);
            // Verifica se o diretório existe antes de tentar removê-lo
            const exists = await fs.pathExists(dirPath);
            if (!exists) {
                console.log(`Directory ${dirPath} does not exist.`);
                resolve(false)
            }

            // Remove o diretório recursivamente
            await fs.remove(dirPath);
            console.log(`Directory ${dirPath} removed!`);
            resolve(true)
        } catch (err) {
            console.error(`Error removing directory ${dirPath}:`, err);
            resolve(false)
        }

    })
};

const listDirectories = async (dirPath) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lê o conteúdo do diretório
            const items = await fs.readdir(dirPath, { withFileTypes: true });

            // Filtra apenas os diretórios e mapeia para um array de objetos
            const directories = items
                .filter(item => item.isDirectory())
                .map(item => ({ name: item.name }));

            resolve(directories)

        } catch (err) {
            console.error(`Erro ao ler o diretorio ${dirPath}:`, err);
            resolve([]);
        }

    })
};

module.exports = { removeDirectory, listDirectories }