const express = require('express');
const cors = require('cors');
const router = express.Router();
const corsOptionsDelegate = require('../cors');
const verificarToken = require('../token');
const torneo = require('../Torneo/logicaTorneo');

var IO = null;

router.post('/votacion/resultados', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    const { idVotacion, peerId } = req.body;
    mysqlConnection.query('SELECT * FROM votacion WHERE id = ?', [idVotacion],  (err, rows, fields) => {
        if(!err){
            var votacion = rows[0];
            res.json(votacion);
            if (new Date(votacion['fechaLimite']).getTime() >= Date.getTime()){
                res.json(JSON.stringify({status: 'Correcto'}));
            }
            else{
                res.json(JSON.stringify({status: 'Error'}));
            }
        }
        else{
            console.log('error en dataBase');
        }
    })
});

function iniciarResultados(nIO) {
    if (IO == null){
        IO = nIO;
    }
}

module.exports = router;
exports.iniciarResultados = iniciarResultados;