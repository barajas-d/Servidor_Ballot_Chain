const express = require('express');
const cors = require('cors');
const router = express.Router();

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
    const { fecha, tipoVotacion, descripcion, votos} = req.body;
    const query = "INSERT INTO votacion (fechaLimite, tipoDeVotacion, descripcion, votos) VALUES (?, ?, ?, ?)";
    mysqlConnection.query(query, [fecha, tipoVotacion, descripcion, votos], (err, rows, fields) => {
        if(!err){
            res.json({Status: rows.id});
        } else {
            console.log(err);
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