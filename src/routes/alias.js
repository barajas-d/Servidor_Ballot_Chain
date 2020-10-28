const express = require('express');
const cors = require('cors');
const router = express.Router();

const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');

const verificarToken = require('../token');

router.post('/aliasConsultar', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    console.log('----Consultar alias----', req.body);
    const { alias, idVotacion } = req.body;
    const query = "SELECT * FROM seudonimo WHERE alias = ? AND idVotacion = ?";
    mysqlConnection.query(query, [alias, idVotacion], (err, rows, fields) => {
        if(!err){
            if (rows.length > 0){
                res.json({status: true});
            } else{
                res.json({status: false});
            }
        } else {
            console.log(err);
            res.json({status: false});
        }
    });
});

module.exports = router;