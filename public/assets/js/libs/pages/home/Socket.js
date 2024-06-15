
/* socket io */
function initSocketIo(){ 
    
    /* socket io conexão */  

    socket = io(base_url, {transports: ['websocket', 'polling', 'flashsocket']});

    socket.on("disconnect", () => { 

        console.log("Erro, o servidor da api não está online, favor verifique.");
       
    });

    socket.on('qrcode', async function (data) {
        console.log("Mensagem recebida (qrcode): ",data);
        await verifyQrcode(data)
        //document.getElementById('messagebox').innerHTML = data;
    });

    socket.on('notificacao', async function (data) {
        console.log("Nova notificação: ",data);
        await verifyQrcode(data)
    
    });

    socket.on('receivedMessage', async function (data) {
        console.log("Mensagem recebida: ",data);
        //document.getElementById('messagebox').innerHTML = data;
    });

    socket.emit('getNotification', { 'instancia': instancia}, async function(data){

            console.log("Dados da instancia consultada: ", data);

    });

}
