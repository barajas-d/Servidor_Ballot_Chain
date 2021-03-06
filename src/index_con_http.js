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
const votosRegistrados = new Map() //key: hash voto, value: seudonimo;

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
        let idVoto = data['idVoto'];
        if (votosRegistrados.has(idVoto)){
            data['alias'] = votosRegistrados.get(idVoto);
            io.emit('voto', data);
        }else{
            enviarVoto(data, idVoto);
        }
        //emitirVoto(data);
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
app.use(require('./routes/alias'));
//Iniciar
app.listen(3000, () =>{
    console.log('Server on port', app.get('port'))
});

peerServer.on('connection', (client) => {
    console.log('Validador conectado');
    // validadores.registrarValidador(client.getId());
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

/* async function emitirVoto(data){
    try {
        if (await comprobarVotosDisponibles(data['usuario'], data['idVotacion'])){
            data['alias'] = await asignarSeudonimo(data);
            io.emit('voto', data);
        }
    } catch (error) {
        console.log(error);
    }
}

async function comprobarVotosDisponibles(nombre, idVotacion){
    let votosDisponibles = await seudonimo.obtenerVotos(nombre, idVotacion);
    if (votosDisponibles > 0){
        return true;
    }
    return false;
}

async function asignarSeudonimo(data) {
    let idVoto = data['idVoto'];
    let idVotacion = data['idVotacion'];
    return await seudonimo.calcularSeudonimo(idVotacion, idVoto);
} */


// --------------------------------------

async function obtenerSeudonimo(data) {
    let idVotacion = data['idVotacion'];
    let nombre = data['usuario'];
    let votosDisponibles = await seudonimo.obtenerVotos(nombre, idVotacion);
    let seudonimos = await seudonimo.obtenerSeudonimos(idVotacion);
    if (seudonimos !== null && seudonimos !== undefined && seudonimos.length > 0 && votosDisponibles > 0){
        let pos = Math.floor(Math.random() * seudonimos.length);
        let seudo = seudonimos[pos];
        await seudonimo.inhabilitarSeudonimo(seudo['id']);
        await seudonimo.restarVotoParticipante(nombre, idVotacion);
        return seudo['alias'];
    }
    return null;
}

async function enviarVoto(data) {
    try {
        data['alias'] = await obtenerSeudonimo(data);
        if (data['alias'] !== null){
            votosRegistrados.set(data['idVoto'], data['alias']);
            io.emit('voto', data);
        }
    } catch (error) {
        console.log(error);
    }
}