const express = require('express');
const cors = require('cors');
const router = express.Router();

const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');

router.get('/grupo', cors(corsOptionsDelegate), (req, res) => {
    mysqlConnection.query('SELECT * FROM grupo', (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.get('/grupo/:id', cors(corsOptionsDelegate), (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM grupo WHERE id = ?', [id],  (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.post('/grupoAdd', cors(corsOptionsDelegate), (req, res) => {
    const { nombre, descripcion, creador } = req.body;
    const query = "INSERT INTO grupo (nombre, descripcion, creador) VALUES (?, ?, ?)";
    mysqlConnection.query(query, [nombre, descripcion, creador], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Votacion guardada'});
        } else {
            console.log(err);
        }
    });
});

router.put('/grupoPut', cors(corsOptionsDelegate), (req, res) => {
    const { id, nombre, descripcion, creador } = req.body;
    const query = "UPDATE grupo SET nombre = ?, descripcion = ?, creador = ? WHERE id = ?";
    mysqlConnection.query(query, [nombre, descripcion, creador, id], (err, rows, fields) => {
        if(!err){
            if(rows.affectedRows == 0){
                res.json({Status: 'No existe el grupo ' + id});
            }
            else{
                res.json({Status: 'Grupo actualizado ' + id});
            }
        } else {
            console.log(err);
        }
    });
});

router.delete('/grupoDelete', cors(corsOptionsDelegate), (req, res) => {
    const { id } = req.body;
    const query = "DELETE FROM grupo WHERE ? = id";
    mysqlConnection.query(query, [id], (err, rows) => {
        if(!err){
            if(rows.affectedRows == 0){
                res.json({Status: 'No existe el grupo ' + id});
            }
            else{
                res.json({Status: 'Grupo eliminado ' + id});
            }
        } else {
            console.log(err);
        }
    })
});

module.exports = router;

