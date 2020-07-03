const express = require('express');
const cors = require('cors');
const router = express.Router();

const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');


router.get('/iniciarsesion', cors(corsOptionsDelegate), (req, res) => {
    const{nombre, contrasena}=req.body;
    mysqlConnection.query('SELECT * FROM usuario WHERE nombre = ? AND contrasena = ?', (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});


router.post('/usuarioAdd', cors(corsOptionsDelegate), (req, res) => {
    console.log("llegue----------------------------------------------------");
    console.log(req.body);
    console.log("----------------------------------------------------------")
    const {  nombre, correo, contrasena } = req.body;
    const query = "INSERT INTO usuario ( nombre, correo, contrasena ) VALUES (?, ?, ?)";
    mysqlConnection.query(query, [nombre, correo, contrasena], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Votacion guardada'});
        } else {
            console.log(err);
        }
    });
});




module.exports = router;