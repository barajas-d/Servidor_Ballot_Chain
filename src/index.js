const express = require('express');
const { ExpressPeerServer } = require('peer');
const app = express();
const httpserver = require('http').createServer(app);
const cors = require('cors');
const validadores = require('./validadores');

const peerServer = ExpressPeerServer(httpserver, {
    debug: true,
    path: '/'
});
 
const peer_port = process.env.PORTPEER || 9000;

httpserver.listen(peer_port, function () {
    console.log("listening peer connections on : " + peer_port);
});

//Configuracion acceso
app.set('port', process.env.PORT || 3000);
//Middlewares
app.use(cors());
app.use(express.json());
//Rutas
app.use('/peerjs', peerServer);
app.use(require('./routes/employees'));
app.use(require('./routes/votacion'));
app.use(require('./routes/grupo'));
app.use(require('./routes/participante'));
app.use(require('./routes/opcion'));
app.use(require('./routes/credencial'));
app.use(require('./routes/usuario'));
app.use(require('./routes/tipoVotacion'));
app.use(require('./routes/validador'));
app.use(require('./routes/votar'));
//Iniciar
app.listen(3000, () =>{
    console.log('Server on port', app.get('port'))
});

peerServer.on('connection', (client) => {
    console.log(client.getId());
    validadores.registrarValidador(client.getId());
    console.log("Peer conectado");
});

peerServer.on('disconnect', (client) => {
    validadores.eliminarValidador(client.getId());
    console.log("Peer desconectado")
});
