const express = require('express');
const cors = require('cors');
const router = express.Router();
const crypto = require('crypto');
const cryptoUpdateMd5 = "ballot_chain";
const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');


router.get('/validadores', (req, res) => {
    console.log('entry');
    mysqlConnection.query('SELECT * FROM validador', (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});


router.put('/activarValidador/:peerId', (req, res) => {
    const { peerId } = req.params;
    const query = "UPDATE validador SET isValidador = ?, WHERE peerId = ?";
    mysqlConnection.query(query, [true, peerId]), (err, rows) => {
        if(!err){
            if(rows.affectedRows == 0){
                res.json({Status: 'No existe el validador ' + id});
            }
            else{
                res.json({Status: 'validador activado ' + id});
            }
        }
        else{
            console.log('No se encontro el peerId');
        }
    }
});

router.put('/desactivarValidador/:peerId', (req, res) => {
    const { peerId } = req.params;
    const query = "UPDATE validador SET isValidador = ?, WHERE peerId = ?";
    mysqlConnection.query(query, [false, peerId]), (err, rows) => {
        if(!err){
            if(rows.affectedRows == 0){
                res.json({Status: 'No existe el validador ' + id});
            }
            else{
                res.json({Status: 'validador activado ' + id});
            }
        }
        else{
            console.log('No se encontro el peerId');
        }
    }
});

module.exports = router; 