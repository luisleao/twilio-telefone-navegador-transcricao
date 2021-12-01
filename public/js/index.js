console.log('Olá DevFest!');

let ligacaoAtual;
let response;

const inicializa = async () => {
	response = await fetch('/token', {method: 'POST'} );
	const data = await response.json();

    device = new Twilio.Device(data.token, {
		enableRingingState: true,
		answerOnBridge: true,
		debug: false,
	});
	let activeConnection;

    console.log('inicializando device.');

	device.on('ready', (device) => {
		console.log('Telefone no navegador está funcionando!');
	});

	device.on('incoming', (connection) => {
		console.log('incoming', escondeNumero(connection.parameters.From));
        if (ligacaoAtual) {
            console.log('tem ligacao atual ja');
            return;
        }
        ligacaoAtual = connection;
        // TODO: adicionar na lista de chamadas recebidas aguardando conexão
	});

	device.on('connect', (connection) => {
		console.log('connect', connection);
        ligacaoAtual = connection;
	});

	device.on('disconnect', (connection) => {
		console.log('disconnect', connection);
        ligacaoAtual = null;
        txtRemoto.innerText = 'remoto';
        txtLocal.innerText = 'local';
    
        // TODO: atualizar lista de items
	})






    const btnLigar = document.getElementById('btnLigar');
    const btnAtender = document.getElementById('btnAtender');
    const btnDesligar = document.getElementById('btnDesligar');
    const btnRecusar = document.getElementById('btnRecusar');
    const btnMute = document.getElementById('btnMute');
    const btnUnmute = document.getElementById('btnUnmute');


    btnAtender.addEventListener('click', () => {
        if (ligacaoAtual) {
            ligacaoAtual.accept();
        }
        ligacaoAtual = null;
    });
    btnRecusar.addEventListener('click', () => {
        if (ligacaoAtual) {
            ligacaoAtual.reject();
        }
        ligacaoAtual = null;
    });

    btnDesligar.addEventListener('click', () => {
        if (device) {
            device.disconnectAll();
        }
        ligacaoAtual = null;
    });

    btnMute.addEventListener('click', () => {
        if (ligacaoAtual) {
            ligacaoAtual.mute();
        }
    });
    btnUnmute.addEventListener('click', () => {
        if (ligacaoAtual) {
            ligacaoAtual.unmute();
        }
    });



    btnLigar.addEventListener('click', () => {
        console.log('botao!');
        var ligacao = device.connect({ To: 'SEU_TELEFONE' });
        console.log('ligacao', ligacao);
    });




    // Websocket para transcricao

    const txtRemoto = document.getElementById('txtRemoto');
    const txtLocal = document.getElementById('txtLocal');
    const websocket = new WebSocket(`wss://${window.location.host}/transcricao`);
    websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('websockeet:', data);

        switch(data.direcao) {
            case 'remoto':
                txtRemoto.innerText = data.transcricao;
                break;
            case 'local':
                txtLocal.innerText = data.transcricao;
                break;
        }
    };
}

document.addEventListener('DOMContentLoaded', inicializa);





