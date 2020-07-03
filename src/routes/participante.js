const express = require('express');
const cors = require('cors');
const router = express.Router();

const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');

router.get('/participanteUsuario/:nombre', cors(corsOptionsDelegate), (req, res) => {
    const { nombre } = req.params;
    mysqlConnection.query(
        'SELECT id, titulo, autor, fechaLimite, plantillaAsociada, tipoDeVotacion, descripcion, votos FROM participante NATURAL JOIN votacion WHERE participante.nombre = ?',
        [nombre],  (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
        }
    })
});

router.get('/participanteVotacion/:id', cors(corsOptionsDelegate), (req, res) => {
    const { id } = req.params;
    mysqlConnection.query(
        'SELECT nombre, saldo, correo, idValidador, bloqAprobados, bloqPropuestos, bloqRevisados, bloqValidados FROM participante NATURAL JOIN usuario WHERE participante.id = ?',
        [id],  (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
        }
    })
});

router.get('/participanteVotacionNum/:id', cors(corsOptionsDelegate), (req, res) => {
    const { id } = req.params;
    mysqlConnection.query(
        'SELECT COUNT(*) FROM participante NATURAL JOIN usuario WHERE participante.id = ?',
        [id],  (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        }
        else{
            console.log(err);
        }
    })
});

router.get('/participanteDelete/:id/:nombre', cors(corsOptionsDelegate), (req, res) => {
    const { id, nombre } = req.params;
    const query = "DELETE FROM participante WHERE id = ? AND nombre = ?";
    mysqlConnection.query(query, [id, nombre], (err, rows) => {
        if(!err){
            if(rows.affectedRows == 0){
                res.json({Status: 'No existe la votacion ' + id + ' o el usuario ' + nombre});
            }
            else{
                res.json({Status: 'Usuario ' + nombre + ' eliminado de la votacion ' + id});
            }
        } else {
            console.log(err);
        }
    })
});

module.exports = router;