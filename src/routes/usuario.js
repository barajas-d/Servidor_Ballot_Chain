const express = require('express');
const cors = require('cors');
const router = express.Router();

const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');

router.get('/iniciarSesion', cors(corsOptionsDelegate), (req, res) => {
    mysqlConnection.query('SELECT * FROM usuario', (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.get('/usuario', cors(corsOptionsDelegate), (req, res) => {
    mysqlConnection.query('SELECT * FROM usuario', (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.get('/usuario/:nombre', cors(corsOptionsDelegate), (req, res) => {
    const { nombre } = req.params;
    mysqlConnection.query('SELECT * FROM usuario WHERE nombre = ?', [nombre],  (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        }
        else{
            console.log(err);
        }
    })
});

router.put('/usuarioPut/:nombreId', cors(corsOptionsDelegate), (req, res) => {
    const { nombreId } = req.params;
    const { nombre, saldo, correo } = req.body;
    const query = "UPDATE usuario SET nombre = ?, saldo = ?, correo = ? WHERE nombre = ?";
    mysqlConnection.query(query, [nombre, saldo, correo, nombreId], (err, rows, fields) => {
        if(!err){
            if(rows.affectedRows == 0){
                res.json({Status: 'No existe el usuario ' + nombre});
            }
            else{
                res.json({Status: 'Usuario actualizado ' + nombre});
            }
        } else {
            console.log(err);
        }
    });
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