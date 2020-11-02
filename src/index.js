const express = require('express');
const fs = require('fs');
const { ExpressPeerServer } = require('peer');
const app = express();
const appSocket = express();
const appPeer = express();
const httpsServer = require('https');
const serverSocket = require('https');
const cors = require('cors');
const socketPort = process.env.PORTSOCKET || 4000;
appSocket.use(cors());
serverSocket.createServer({
    key: fs.readFileSync('ssl.key/private.key'),
    cert: fs.readFileSync('ssl.crt/certificate.crt')},
    appSocket).listen(socketPort);
//const httpserver = require('http').createServer(app);

const validadores = require('./validadores');
//const server = require('http').createServer(app);
const io = require('socket.io')(serverSocket, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": '*',
            "Access-Control-Allow-Origin": 'https://pocketballotchain.webhop.me:*', //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Methods": "OPTIONS, GET"
        };
        res.writeHead(200, headers);
        res.end();
    }
});
const cifrado = require('./cifrado');
const torneo = require('./Torneo/logicaTorneo');
const seudonimo = require('./Seudonimos/seudonimo');
//const now = require('nano-time');
//var validadoresActivos = require('./Torneo/logicaTorneo');
//Variables de torneo
var tiempoSigTorneo=10000;
const votosRegistrados = new Map() //key: hash voto, value: seudonimo;

//Listener por socket.io ------------------

io.origins((origin, callback) => {
    //if (origin !== 'https://foo.example.com') {
    //    return callback('origin not allowed', false);
    //}
    callback(null, true);
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

io.on('disconnect', () => {
    console.log('Algo se desconecto');
});

//INICIO SOCKET HTTPS

//Fin Listener por socket.io


const peerServer = ExpressPeerServer(httpsServer, {
    debug: true,
    path: '/'
});
 
const peer_port = process.env.PORTPEER || 5000;
httpsServer.createServer({
    key: fs.readFileSync('ssl.key/private.key'),
    cert: fs.readFileSync('ssl.crt/certificate.crt')
}, app).listen(peer_port, function(){
console.log("Peer https server listening on port " + peer_port + "...");
});


//Middlewares

app.use(express.json());
app.use(cors());
//PeerJs
//app.use('/peerjs', peerServer);
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
//Configuracion acceso e inicio REST
const rest_port = process.env.PORT || 3000;
httpsServer.createServer({
    key: fs.readFileSync('ssl.key/private.key'),
    cert: fs.readFileSync('ssl.crt/certificate.crt')
}, app).listen(rest_port);

//--FIN Configurar acceso e inicio REST
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