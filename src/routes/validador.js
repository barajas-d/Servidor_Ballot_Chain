const express = require('express');
const cors = require('cors');
const router = express.Router();
const crypto = require('crypto');
const cryptoUpdateMd5 = "ballot_chain";
const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');
const verificarToken = require('../token');
const logicaTorneo = require('../Torneo/logicaTorneo');

router.post('/usuarioValidador', (req, res) => {
    const { peerId, nombre } = req.body;
    const query = "UPDATE validador SET nombreValidador=? WHERE peerId=?";
    mysqlConnection.query(query, [nombre, peerId], (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('No se encontro el validador');
        }
    })
});

router.get('/validadores', cors(corsOptionsDelegate), (req, res) => {
    console.log('entry jaja');
    mysqlConnection.query('SELECT * FROM validador where isValidador = ?', [true], (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});


router.get('/activarValidador/:peerId', cors(corsOptionsDelegate), (req, res) => {
    const { peerId } = req.params;
    const query = "UPDATE validador SET isValidador = ? WHERE peerId = ?";
    mysqlConnection.query(query, [true, peerId]), (err, rows) => {
        if(!err){
            if(rows.affectedRows == 0){
                res.json({Status: 'No existe el validador'});
            }
            else{
                res.json({Status: 'validador activados'});
            }
        }
        else{
            res.json({Status: 'No se encontro el peerId'});
        }
    }
});

router.get('/desactivarValidador/:peerId', cors(corsOptionsDelegate), (req, res) => {
    const { peerId } = req.params;
    const query = "UPDATE validador SET isValidador = ? WHERE peerId = ?";
    mysqlConnection.query(query, [false, peerId]), (err, rows) => {
        if(!err){
            if(rows.affectedRows == 0){
                res.json({Status: 'No existe el validador'});
            }
            else{
                res.json({Status: 'validador activado'});
            }
        }
        else{
            res.json({Status: 'No se encontro el peerId'});
        }
    }
});

router.post('/confirmarBlockChainActualizada', verificarToken, (req, res) => {
    const nombre = req.userId;
    const { hashBlockchain } = req.body;
    logicaTorneo.notificarValidadorActivo(nombre, hashBlockchain);
});

module.exports = router; 