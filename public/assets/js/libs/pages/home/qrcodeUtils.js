/* tratativas para qrcode status */
async function verifyQrcode(retorno){

    return new Promise( async (resolve, reject) => {

            /* atualizar o qrcode */
            if(retorno.qrcode){
                var qrc = base_url + '/' + retorno.qrcode + '?timestamp=' + new Date().getTime(); /* adicionar timer para refresh da imagem */
                if ($("#qrcodeImg").length){
                    $("#qrcodeTitle").html('Leia o qrcode para ' + instancia + '.');
                    $("#qrcodeImg").attr("src",qrc); 
                }
                resolve(false); /* ainda nao conectado */
            }else if(retorno.status == "DISCONECTED"){

                /* o tempo limite para sincronizar qrcode, expirou... */
                $("#qrcodeImg").attr("src",base_url + "assets/img/conection/disconnected.png");
                $("#qrcodeTitle").html('O tempo limite para leitura do qrcode expirou, por favor <b>DESCONECTAR-SE</b> e  solicitar uma nova conexão.');
                
                resolve(false);

                
            }else if(retorno.qrcode == undefined && retorno.status == 'UNPAIRED'){
                /* aguardar geração do qrcode */
                if ($("#qrcodeImg").length){

                    $("#qrcodeTitle").html('Gerando qrcode para ' + instancia + '...'); 
                    $("#qrcodeImg").attr("src",base_url + "/assets/img/conection/loadingqr.gif");
                }

                resolve(false);
            }else{
                /* se não retornar qrcode, exibir imagem de desconexão */
                if ($("#qrcodeImg").length){
                    $("#qrcodeTitle").html('Instância ' + instancia + ' desconectada.');
                    $("#qrcodeImg").attr("src",base_url + "/assets/img/conection/disconnected.png");
                }  
                
                resolve(false);

            } 


            /* tratar conexão  */
            if(retorno.status == 'qrReadSuccess' || retorno.status == 'inChat' || retorno.status == 'CONNECTED'){

                if ($("#qrcodeImg").length){

                    $("#qrcodeTitle").html('Instância ' + instancia + ' conectada. 👍');
                    $("#qrcodeImg").attr("src",base_url + "/assets/img/conection/success.png");
                }

                resolve(true);
            }

            if(retorno.status == 'qrcodeReadError' || retorno.status == 'autocloseCalled' || retorno.status == 'browserClose'){

                if ($("#qrcodeImg").length){

                    $("#qrcodeTitle").html('Instância ' + instancia + ' desconectada excedeu limite para gerar qrcodes.');
                    $("#qrcodeImg").attr("src",base_url + "/assets/img/conection/disconnected.png");
                }

                resolve(false);
            }
          


        });



}