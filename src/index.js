const express = require('express');
const { ExpressPeerServer } = require('peer');
const app = express();
const httpserver = require('http').createServer(app);
const cors = require('cors');
const validadores = require('./validadores');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cifrado = require('./cifrado');
const torneo = require('./Torneo/logicaTorneo');
const seudonimo = require('./Seudonimos/seudonimo');
//const now = require('nano-time');
//var validadoresActivos = require('./Torneo/logicaTorneo');
//Variables de torneo
var tiempoSigTorneo=10000;

//Listener por socket.io ------------------
io.on('connection', (socket) => {
    console.log('Nueva coneccion');
    socket.emit('voto', 'ListenerEstablecido');

    socket.on('voto', data => {

        //Aqui debo validar firmas y reempaquetar
        
        if(cifrado.checkSing(data['voto'], data['firma'], data['firmaKey'])){
            console.log('FIRMA CORRECTA');
        }
        else{
            console.log('FIRMA ERRADA');
            //socket.emit('error', "No se registro el voto");
        }

        
        data['firma'] = cifrado.sign(data['voto'])
        data['firmaKey'] = cifrado.getSignaturePublic();
        //enviarVoto(data);
        io.emit('voto', data);

    });

    // MIRAR SI SIRVE PA' ALGO--------------------------------
    socket.on('resivirVoto', data => {
        console.log('entro un mensaje');
        socket.emit('voto', "voto de ejemplo");
    });
    //--------------------------------------------------------
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
 
const peer_port = process.env.PORTPEER || 5000;

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
app.use(require('./routes/resultados'));
//Iniciar
app.listen(3000, () =>{
    console.log('Server on port', app.get('port'))
});

peerServer.on('connection', (client) => {
    console.log('Validador conectado');
    validadores.registrarValidador(client.getId());
});

peerServer.on('disconnect', (client) => {
    console.log('validador desconectado');
    validadores.eliminarValidador(client.getId());
});

deleteValidadores().then(() => {torneo.iniciarTorneo(io)});

async function deleteValidadores() {
    try {
        validadores.eliminarValidadores();
    } catch (error) {
        console.log(error);
    }
}

async function obtenerSeudonimo(idVotacion) {
    let seudonimos = await seudonimo.obtenerSeudonimos(idVotacion);
    console.log('Seudonimos',seudonimos);
    if (seudonimos !== null && seudonimos !== undefined && seudonimos.length > 0){
        let pos = Math.floor(Math.random() * seudonimos.length);
        let seudo = seudonimos[pos];
        console.log('Seudonimo escogido', seudo);
        await seudonimo.inhabilitarSeudonimo(seudo['id']);
        return seudo['alias'];
    }
    return null;
}

async function enviarVoto(data) {
    try {
        data['seudonimo'] = await obtenerSeudonimo(data['idVotacion']);
        console.log('---Seudonimo asignado---', data['seudonimo']);
        if (data['seudonimo'] !== null){
            io.emit('voto', data);
        }
    } catch (error) {
        console.log(error);
    }
}