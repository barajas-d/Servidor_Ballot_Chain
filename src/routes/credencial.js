const express = require('express');
const cors = require('cors');
const router = express.Router();

const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');


router.get('/credencial', cors(corsOptionsDelegate), (req, res) => {
    mysqlConnection.query('SELECT * FROM credencial', (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.get('/credencial/:id', cors(corsOptionsDelegate), (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM credencial WHERE clave = ? AND isValid = True', [id],  (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.post('/CredencialesAdd', cors(corsOptionsDelegate), (req, res) => {
    const { fecha, tipoVotacion, descripcion, votacion, cantCredenciales} = req.body;
    const query = "INSERT INTO votacion (fechaLimite, tipoDeVotacion, descripcion, votos) VALUES (?, ?, ?, ?)";
    mysqlConnection.query(query, [fecha, tipoVotacion, descripcion, votos], (err, rows, fields) => {
        if(!err){
            res.json({Status: rows.id});
        } else {
            console.log(err);
        }
    });
});


router.get('/credencialesData/:votacion', cors(corsOptionsDelegate), (req, res) => {
    const { votacion } = req.params;
    const query = "SELECT clave FROM credencial WHERE votacion = ? AND isValid = true";
    mysqlConnection.query(query, [votacion], (err, rows) => {
        if(!err){
            if(rows.length == 0){
                res.json({Status: "No hay credenciales"});
            }
            else{
                res.json({Credenciales: rows});
            }  
        }
        else{
            res.json({Error: "No se pueden pedir las credenciales"})
        }
    })
})

module.exports = router;