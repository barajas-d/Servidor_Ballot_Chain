const express = require('express');
const cors = require('cors');
const router = express.Router();

const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');

router.get('/tipoVotacion/:id', cors(corsOptionsDelegate), (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM tipoVotacion WHERE id = ?', [id],  (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

module.exports = router;