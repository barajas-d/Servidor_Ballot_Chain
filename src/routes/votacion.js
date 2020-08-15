const express = require('express');
const cors = require('cors');
const router = express.Router();
const crypto = require('crypto');
const cryptoUpdateMd5 = "ballot_chain";
const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');


router.get('/votacion', cors(corsOptionsDelegate), (req, res) => {
    mysqlConnection.query('SELECT * FROM votacion', (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.get('/votacion/:id', cors(corsOptionsDelegate), (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM votacion WHERE id = ?', [id],  (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.post('/votacionAdd', cors(corsOptionsDelegate), (req, res) => {
    const { titulo, autor, fechaInicio, fechaLimite, tipoDeVotacion, descripcion, cantCredenciales, votos, participantes  } = req.body;
    const query = "INSERT INTO votacion (titulo, autor, fechaInicio, fechaLimite, tipoDeVotacion, descripcion, votos) values (?, ?, ?, ?, ?, ?, ?);";
    //const query = "INSERT INTO votacion (fechaLimite, tipoDeVotacion, descripcion, votos) VALUES (?, ?, ?, ?)";
    console.log(participantes);
    console.log('Credenciales: ' + cantCredenciales);
    mysqlConnection.query(query, [titulo, autor, '2020-10-20', '2020-10-20', tipoDeVotacion, descripcion, votos], (err, rows, fields) => {
        if(!err) {
            if(cantCredenciales == undefined || cantCredenciales == 0){
                res.json({Status: "Votacion creada con exito", Id: rows["insertId"], Credenciales: 0});
            }
            else{
                const queryCrearCredencial = "INSERT INTO credencial(votacion) VALUES (?)";
                const queryActualizarCredencial = "UPDATE credencial SET clave = ?, isValid = ? where credencial.id = ?";
                var respuesta = [];
                var credencialPreProcesada;
                var credencial;
                for (let i = 0; i < cantCredenciales; i++) {
                    mysqlConnection.query(queryCrearCredencial, [rows["insertId"]], (errCrear, rowsCrear) => {
                        if(!errCrear) {
                            credencialPreProcesada = rows["insertId"].toString() + rowsCrear["insertId"].toString();
                            credencial = crypto.createHash('md5').update(credencialPreProcesada).digest("hex");
                            mysqlConnection.query(queryActualizarCredencial, [credencial, true, rowsCrear['insertId']]);
                        }
                    });
                }
                res.json({Status: "Votacion creada con exito", Id: rows["insertId"], Credenciales: cantCredenciales});
            }
        } else {
            res.json({Error: 'Error al crear la votacion'});
        }
    });
});


router.put('/votacionPut', cors(corsOptionsDelegate), (req, res) => {
    const { id, fecha, tipoVotacion, descripcion, votos } = req.body;
    const query = "UPDATE votacion SET fechaLimite = ?, tipoDeVotacion = ?, descripcion = ?, votos = ? WHERE id = ?";
    mysqlConnection.query(query, [fecha, tipoVotacion, descripcion, votos, id], (err, rows, fields) => {
        if(!err){
            if(rows.affectedRows == 0){
                res.json({Status: 'No existe la votacion ' + id});
            }
            else{
                res.json({Status: 'Votacion actualizada ' + id});
            }
        } else {
            console.log(err);
        }
    });
});

router.delete('/votacionDelete', cors(corsOptionsDelegate), (req, res) => {
    const { id } = req.body;
    const query = "DELETE FROM votacion WHERE ? = id";
    mysqlConnection.query(query, [id], (err, rows) => {
        if(!err){
            if(rows.affectedRows == 0){
                res.json({Status: 'No existe la votacion ' + id});
            }
            else{
                res.json({Status: 'Votacion eliminada ' + id});
            }
        } else {
            console.log(err);
        }
    })
});

router.get('/votacionAutor/:nombre', cors(corsOptionsDelegate), (req, res) => {
    const { nombre } = req.params;
    mysqlConnection.query('SELECT * FROM votacion WHERE autor = ?', [nombre],  (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
        }
    })
});

module.exports = router;