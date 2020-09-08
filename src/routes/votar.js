const express = require('express');
const router = express.Router();
const cors = require('cors');
const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');
const cifrado = require('./../cifrado');

router.post('/redirigir', cors(corsOptionsDelegate), (req, res) => {
    const { voto, firma, peerValidador, encryptId } = req.body;

    //console.log("mensaje: " + voto);
    //console.log("firma: " + firma);
    //console.log("peerValidador: " + peerValidador);
    //console.log("encryptId: " + encryptId);
    
    //console.log('ESTA FIRMADA CORRECTAMENTE?: ' + cifrado.checkSing(voto, firma));

    //REDIRIGIR EL MENSAJE A LOS VALIDADORES AQUI 

    //
    
    res.json({Status: "Voto redirigido"});
});

module.exports = router;