const express = require('express');
const cors = require('cors');
const router = express.Router();

const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');

const verificarToken = require('../token');

router.get('/participanteUsuario', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    const nombre = req.userId;
    mysqlConnection.query(
        'SELECT v.id, titulo, autor, fechaInicio, fechaLimite, plantillaAsociada, tipoDeVotacion, descripcion, votos '+
        'FROM participante AS p INNER JOIN votacion as v ON p.idVotacion = v.id '+
        'WHERE p.nombre = ?',
        [nombre],  (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
        }
    })
});

router.get('/participanteVotacion/:id', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    const { id } = req.params;
    mysqlConnection.query(
        'SELECT u.nombre, saldo, correo, idValidador, reputacion, bloqAprobados, bloqPropuestos, bloqRevisados, bloqValidados '+
        'FROM participante AS p INNER JOIN usuario AS u ON p.nombre = u.nombre '+
        'WHERE p.idVotacion = ?',
        [id],  (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
        }
    })
});

router.get('/participanteVotacionNum/:id', verificarToken, cors(corsOptionsDelegate), (req, res) => {
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

router.get('/participanteDelete/:id/:nombre', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    const { id, nombre } = req.params;
    const query = "DELETE FROM participante WHERE idVotacion = ? AND nombre = ?";
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

router.get('/participanteVotos/:idVotacion/:nombre', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    const { idVotacion, nombre } = req.params;
    const query = "SELECT votosDisponibles FROM participante WHERE idVotacion = ? AND nombre = ?";
    mysqlConnection.query(query, [idVotacion, nombre], (err, rows) => {
        if(!err){
            if (rows.length > 0){
                res.json(rows[0]);
            }else{
                res.json({votosDisponibles: -1});
            }
        } else {
            console.log(err);
        }
    })
});

router.get('/votosEmitidosVotacion/:idVotacion', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    const { idVotacion } = req.params;
    const query = "SELECT * FROM seudonimo WHERE idVotacion = ? AND disponible = ?";
    mysqlConnection.query(query, [idVotacion, 0], (err, rows) => {
        if(!err){
            res.json(rows.length);
        } else {
            console.log(err);
        }
    })
});

module.exports = router;