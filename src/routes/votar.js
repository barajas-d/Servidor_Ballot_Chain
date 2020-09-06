const express = require('express');
const router = express.Router();
const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');

router.post('/redirigir', (req, res) => {
    const { mensaje, firma, peerValidador, encryptId } = req.body;
    console.log("mensaje: " + mensaje);
    console.log("firma: " + firma);
    console.log("peerValidador: " + peerValidador);
    console.log("encryptId: " + encryptId);

    //Validar Firma

    //
    
    //REDEIRIGIR EL MENSAJE A LOS VALIDADORES AQUI 

    //

    res.json({Status: "hola"});
});

module.exports = router;