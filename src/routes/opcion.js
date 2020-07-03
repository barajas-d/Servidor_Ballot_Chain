const express = require('express');
const cors = require('cors');
const router = express.Router();

const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');


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