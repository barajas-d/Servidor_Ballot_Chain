const express = require('express');
const cors = require('cors');
const router = express.Router();

const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');


router.get('/opcion', cors(corsOptionsDelegate), (req, res) => {
    mysqlConnection.query('SELECT * FROM opcion', (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.get('/opcion/votacion/:id', cors(corsOptionsDelegate), (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM opcion WHERE votacion = ?', [id],  (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});



router.post('/opcionAdd', cors(corsOptionsDelegate), (req, res) => {
    const { idVotacion, identificacion, descripcion, nombre } = req.body;
    const query = "INSERT INTO opcion (idVotacion, identificacion, descripcion, nombre) VALUES (?, ?, ?, ?)";
    mysqlConnection.query(query, [idVotacion, identificacion, descripcion, nombre], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Opcion guardada'});
        } else {
            console.log(err);
        }
    });
});



module.exports = router;