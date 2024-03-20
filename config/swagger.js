const swaggerUI = require("swagger-ui-express");
const swaggerDoc = require("swagger-jsdoc");
const swaggerJson = require("../swagger.json")

exports.swaggerGen = async (route, app) => {

    return new Promise(async (resolve, reject) => {

        /*  var swaggerDef = {
              openapi: "3.0.0",
              info: {
                  title: "I.API-js",
                  version: "1.0.0",
                  description: "A i.api-js é uma api desenvolvida em javascript, para fornecer funcionalidades de treinamento da I.A. chatgpt.",
                  contact: {
                      email: "jaderesp@gmail.com"
                  }
              },
              components: {
                  schemas: require("../schemas/ftuning_schema.json")
              }
  
  
          }
  
          var options = {
              swaggerDefinition: swaggerDef,
              apis: [`../src/routes/index.js`]
          }
  
          var swaggerSpec = swaggerDoc(options); */

        if (app) {

            if (!route) {
                console.log("\r\n Não foi fornecido uma rota para gerar a documentação!");
                resolve(app);
                return;
            }

            /* rota da documentação no express 
                link: https://youtu.be/WhFx2heoFrA?t=700
            */
            app.use(route, swaggerUI.serve);
            app.get(route, swaggerUI.setup(swaggerJson));

            resolve(app);
            return;

        } else {
            console.log("\r\n App não inicializado para gerar  a documentação das rotas.")
            resolve();
            return;
        }

    });


}
