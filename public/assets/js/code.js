/* vars globals */
let base_url = $("#baseUrl").val(); //'http://localhost:3000';
let socket = null;
let instancia = $("#instancia").val();



function verify(){

        /* customizações das paginas aqui... */
        var inter = setInterval(function(){

            console.log("verificação em andamento...\r");

            if($("#qrcodeImg").length){

                //console.log("👍 Elemento existente...\r");
                let instancia = $("#instancia").val();
                let qrcode = $("#qrcode").val();
                let status = $("#status").val();


                if(status == true){



                }


            }

        },500);

}

