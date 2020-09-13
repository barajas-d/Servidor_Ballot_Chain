const express = require('express');
const { ExpressPeerServer } = require('peer');
const app = express();
const httpserver = require('http').createServer(app);
const cors = require('cors');
const validadores = require('./validadores');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cifrado = require('./cifrado');


//Listener por socket.io
io.on('connection', (socket) => {
    console.log('Nueva coneccion');
    socket.emit('voto', 'ListenerEstablecido');

    socket.on('voto', data => {
        console.log('entro un mensaje: ' + data['peerValidador']);

        //Aqui debo validar firmas y reempaquetar
        
        if(cifrado.checkSing(data['voto'], data['firma'])){
            console.log('FIRMA CORRECTA');
        }
        else{
            console.log('FIRMA ERRADA');
            //socket.emit('error', "No se registro el voto");
        }

        data['firma'] = cifrado.sign('voto')

        io.emit('voto', data);
    });

    socket.on('resivirVoto', data => {
        console.log('entro un mensaje');
        socket.emit('voto', "voto de ejemplo");
    });
});

io.on('disconnect', () => {
    console.log('Algo se desconecto');
});

const listenerPort = process.env.PORTLISTENER || 4000;
server.listen(listenerPort, function(){
    console.log("Socket listening on port : " + listenerPort);
});
//Fin Listener por socket.io


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
//PeerJs
app.use('/peerjs', peerServer);
//Rutas
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
    //console.log(client.getId());
    validadores.registrarValidador(client.getId());
    //console.log("Peer conectado");
});

peerServer.on('disconnect', (client) => {
    validadores.eliminarValidador(client.getId());
    //console.log("Peer desconectado")
});
