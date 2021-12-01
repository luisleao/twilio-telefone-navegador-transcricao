# VOIP direto no navegador com a Twilio
## Bônus: transcrição em tempo real com Google Speech to Text

Na demonstração é possível receber e realizar uma chamada telefônica através da infra-estrutura da Twilio para um número de telefone diretamente do navegador.

Para executar é necessário que você configure o arquivo `.env`.
Faça uma cópia do arquivo `.env.sample` e inclua as variáveis informadas.

Não se esqueça de rodar o `npm install` na raiz do projeto para instalar as dependências.

Para rodar uma conexão VoIP no navegador também é necessário configurar o `TwiML Apps` no console da Twilio na opção `Phone Numbers`. Ele vai apontar para o endpoin `/saida`.

Para receber uma ligação telefônica e redirecionar para a conexão VoIP, basta configurar o webhook do número de telefone e apontar para o endpoint `/entrada`. Lembrando que sua url deve ser pública e acessível na internet.

Para ativar o serviço de transcrição, crie um projeto do Google Cloud e ative o produto Speech do Text. Na sequência gere as chaves de uma nova conta de serviço e salve o arquivo json na sua estrutura.

Você também precisa mudar o host do websocket. Tenha certeza de que utilizou um domínio público (instale o Ngrok se for o caso para criar um redirecionamento para o localhost).



## Links da documentação

* https://www.twilio.com/docs/voice/sdks/javascript
* https://www.twilio.com/docs/voice/twiml/dial
* https://www.twilio.com/docs/voice/twiml/stream



