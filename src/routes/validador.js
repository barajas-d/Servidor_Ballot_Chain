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




module.exports = router; 