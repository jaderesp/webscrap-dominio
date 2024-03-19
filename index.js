const login = require("./cookies/cookies");
const chat = require("./controller/chat");

const start = async () => {
    try {
        const email = "jaderesp@gmail.com"; // type your email with which you registered chatGPT.
        const password = "adm192*#1"; // type your password with which you registered chatGPT.
        await login(email, password); // Once you login you can comment this line out.

        const input = "Olá boa tarde, pode gerar um algorimo que some dois numeros em javascript."; //here your input goes.
        const output = await chat(input);
        console.log(output);

    } catch (error) {
        console.log(error);
    }
}

start();
