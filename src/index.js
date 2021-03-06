const fs = require('fs');
const express = require('express');
const { ExpressPeerServer } = require('peer');
const app = express();
var httpsRest;
const appsocket = express();
const appPeer = express();
var httpsPeer; 
const cors = require('cors');
const validadores = require('./validadores');
//const server = require('http').createServer(app);
const cifrado = require('./cifrado');
const torneo = require('./Torneo/logicaTorneo');
const seudonimo = require('./Seudonimos/seudonimo');
//const now = require('nano-time');
//var validadoresActivos = require('./Torneo/logicaTorneo');
//Variables de torneo
var tiempoSigTorneo=10000;
const votosRegistrados = new Map() //key: hash voto, value: seudonimo;

//Listener por socket.io ------------------


//--CONFIGURACION DEL SERVIDOR Y PUERTOS------
app.use(cors());

var optionsHttps = {
    key: fs.readFileSync('ssl.key/private.key'),
    cert: fs.readFileSync('ssl.crt/certificate.crt')
}
var origins = 'https://pocketballotchain.webhop.me:*';

const listenerPort = process.env.PORTLISTENER || 4000;

var httpsSocketApp = require('https').createServer(optionsHttps, function(req, res){
    res.setHeader('Access-Control-Allow-Origin', origins);
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if ( req.method === 'OPTIONS' || req.method === 'GET' ) {
        res.writeHead(200);
        res.end();
        return;
    }
});

var io = require('socket.io')(httpsSocketApp);
httpsSocketApp.listen(listenerPort, function(){
    console.log("Socket listening on port : " + listenerPort);
});

//Fin Listener por socket.io

var httpsServer = require('https').createServer(optionsHttps, app);
const peerServer = ExpressPeerServer(httpsServer, {
    debug: true,
    path: '/'
});
const peer_port = process.env.PORTPEER || 5000;

httpsServer.listen(peer_port, function () {
    console.log("listening peer connections on : " + peer_port);
});

//--CONFIGURACION Y FUNCIONES REST--------

//Configuracion acceso
var httpsRest = require('https');
httpsRest.createServer(optionsHttps, app).listen(3000, function(){
    console.log('REST en ' + 3000);
});
//Middlewares
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

// ---FUNCIONES SOCKET IO-----------------


io.on('disconnect', () => {
    console.log('Algo se desconecto');
});


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


//----FUNCIONES PEERJS---------------------------

peerServer.on('connection', (client) => {
    console.log('Validador conectado');
    // validadores.registrarValidador(client.getId());
});

peerServer.on('disconnect', (client) => {
    console.log('validador desconectado');
    validadores.eliminarValidador(client.getId());
});

// --------------------------------------

deleteValidadores().then(() => {torneo.iniciarTorneo(io)});

async function deleteValidadores() {
    try {
        validadores.eliminarValidadores();
    } catch (error) {
        console.log(error);
    }
}

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