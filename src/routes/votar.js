const express = require('express');
const router = express.Router();
const cors = require('cors');
const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');
const cifrado = require('../cifrado');
const jwt = require('jsonwebtoken');

const secretKey = '123456789'

router.post('/redirigir', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    //const { voto, firma, peerValidador, encryptId } = req.body;
    const { peerValidador, mensaje} = req.body;
    console.log("EL JSON recibido es:", req.body);
    //console.log("mensaje: " + voto);
    //console.log("firma: " + firma);
    //console.log("peerValidador: " + peerValidador);
    //console.log("encryptId: " + encryptId);
    
    //console.log('ESTA FIRMADA CORRECTAMENTE?: ' + cifrado.checkSing(voto, firma));

    console.log("EL PEERID es: " + peerValidador);
    
    peerJs.enviarMensaje(mensaje, peerValidador);
    //REDIRIGIR EL MENSAJE A LOS VALIDADORES AQUI 
    
    //
    
    res.json({Status: "Voto redirigido"});
});

function verificarToken(req, res, next) {
    //console.log(req.headers);
    if (!req.headers.authorization) {
        //console.log("primer if");
        return res.status(401).send('Solicitud no autorizada');
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        //console.log("segundo if");
        return res.status(401).send('Solicitud no autorizada');
    }
    const datos = jwt.verify(token, secretKey)
    req.userId = datos._id;
    next();
}


//--------Funciones PeerJs------------

//------------------------------------

module.exports = router;