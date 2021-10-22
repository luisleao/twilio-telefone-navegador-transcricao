
require('dotenv').config();
const PORT = process.env.PORT;

const express = require('express');
const app = express();
const server = require('http').createServer(app);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))

const Twilio = require('twilio');
const VoiceResponse = Twilio.twiml.VoiceResponse;



app.get('/', (req, res) => {
    res.sendFile('/public/index.html', { root: __dirname });
})

app.post('/token', async (req, res) => {
    const AccessToken = Twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const accessToken = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.API_KEY,
        process.env.API_SECRET
    );
    accessToken.identity = process.env.IDENTITY;

    const grant = new VoiceGrant({
        incomingAllow: true,
        outgoingApplicationSid: process.env.APP_SID
    });
    accessToken.addGrant(grant);

    res.send({
        identity: process.env.IDENTITY,
        token: accessToken.toJwt()
    });
});


app.post('/entrada', async (req, res) => {
    console.log('entrada!')
	res.contentType('xml');
	const twiml = new VoiceResponse();
    twiml.say({ language: 'pt-BR', voice: 'Polly.Camila-Neural' }, 'Aguarde... Estamos conectando com o Leão!')
	
	// incluir transcricao
    twiml.start().stream({
        track: 'inbound_track', // inbound_track, outbound_track, both_tracks
        name: `${req.body.CallSid}-remoto`,
        url: `wss://leao.ngrok.io/${req.body.CallSid}-remoto`
    });
    twiml.start().stream({
        track: 'outbound_track', // inbound_track, outbound_track, both_tracks
        name: `${req.body.CallSid}-local`,
        url: `wss://leao.ngrok.io/${req.body.CallSid}-local`
    });
    const dial = twiml.dial();
    dial.client(process.env.IDENTITY);
	res.send(twiml.toString());
});

app.post('/saida', async (req, res) => {
	console.log('body: ', req.body);

	res.contentType('xml');
	const twiml = new VoiceResponse();
	twiml.say({ language: 'pt-BR', voice: 'Polly.Camila-Neural' }, 'Iniciando ligação');

    twiml.start().stream({
        track: 'inbound_track', // inbound_track, outbound_track, both_tracks
        name: `${req.body.CallSid}-local`,
        url: `wss://leao.ngrok.io/${req.body.CallSid}-local`
    });
    twiml.start().stream({
        track: 'outbound_track', // inbound_track, outbound_track, both_tracks
        name: `${req.body.CallSid}-remoto`,
        url: `wss://leao.ngrok.io/${req.body.CallSid}-remoto`
    });

	const dial = twiml.dial({ 
        callerId: process.env.TWILIO_NUMBER, 
    }, req.body.To);

	dial.client(process.env.IDENTITY);
	res.send(twiml.toString());
});








let wsTranscricao;
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws, req) => {
    const callSid = req.url.replace('/', '');
    console.log('WSS CONNECTION ', callSid);
    switch (callSid) {
        case 'transcricao':
            wsTranscricao = ws;
            console.log('browser conectado para receber streaming de transcrição');
            break;
        default:
            const recognizeStream = client
                .streamingRecognize(request)
                .on("error", console.error)
                .on("data", async data => {
                    let inout = req.url.replace('/', '').split('-')[1];
                    console.log('SPEECH: ', inout, ' > ', data.results[0].alternatives[0].transcript);
                    if (wsTranscricao) {
                        wsTranscricao.send(JSON.stringify({
                            direcao: inout,
                            transcricao: data.results[0].alternatives[0].transcript
                        }));
                    } else {
                        console.log('sem websocket');
                    }
            });

            ws.on("message", function incoming(message) {
                const msg = JSON.parse(message);
                switch (msg.event) {
                    case "connected":
                        console.log(`Uma nova chamada foi conectada.`);
                        break;
                    case "start":
                        console.log(`Começando Media Stream ${msg.streamSid}`);
                        break;
                    case "media":
                        // console.log('Recebendo áudio...');
                        if (recognizeStream.destroyed) return;
                        recognizeStream.write(msg.media.payload);
                        break;
                    case "stop":
                        console.log(`Chamada finalizada!`);
                        recognizeStream.destroy();
                        break;
                }
            });	
    }
});
// Initialize Google Speech to Text
const speech = require("@google-cloud/speech");
const client = new speech.SpeechClient();
// Setup Transcription Request
const request = {
	config: {
		encoding: "MULAW",
		sampleRateHertz: 8000,
		languageCode: "pt-BR"
	},
	interimResults: true
};

