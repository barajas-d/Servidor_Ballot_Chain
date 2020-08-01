const express = require('express');
const cors = require('cors');
const router = express.Router();
const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');
const jwt = require('jsonwebtoken');

const secretKey = '123456789'

router.get('/log', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    console.log("Usuario logueado: " + req.userId);
    res.json({
        status: req.userId,
        id: 0
    })
});

router.get('/grupo', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    mysqlConnection.query('SELECT * FROM grupo', (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.get('/grupo/:id', verificarToken,cors(corsOptionsDelegate), (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM grupo WHERE id = ?', [id],  (err, rows, fields) => {
        if(!err){
            console.log(rows[0]);
            res.json(rows[0]);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.post('/grupo', verificarToken,cors(corsOptionsDelegate), (req, res) => {
    const { nombre, descripcion, creador } = req.body;
    const query = "INSERT INTO grupo (nombre, descripcion, creador) VALUES (?, ?, ?)";
    mysqlConnection.query(query, [nombre, descripcion, creador], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Grupo guardado', id: rows.insertId});
        } else {
            console.log(err);
        }
    });
});

router.delete('/grupo/:id', verificarToken,cors(corsOptionsDelegate), (req, res) => {
    const { id } = req.params;
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

router.put('/grupo', verificarToken, cors(corsOptionsDelegate), (req, res) => {
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

router.get('/usuario', verificarToken,cors(corsOptionsDelegate), (req, res) => {//esto es de usuario
    mysqlConnection.query('SELECT * FROM usuario', (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.get('/usuario/:nombre', verificarToken,cors(corsOptionsDelegate), (req, res) => {//esto es de usuario
    const { nombre } = req.params;
    mysqlConnection.query('SELECT * FROM usuario WHERE nombre = ?', [nombre],  (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.get('/miembro/grupo/:id', verificarToken,cors(corsOptionsDelegate), (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM usuario AS t1 INNER JOIN miembro AS t2 WHERE t1.nombre = t2.idUsuario AND t2.idGrupo = ?', [id],  (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.post('/miembro', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    const { idUsuario, idGrupo} = req.body;
    const query = "INSERT INTO miembro (idUsuario, idGrupo) VALUES (?, ?)";
    mysqlConnection.query(query, [idUsuario, idGrupo], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Miembro guardado'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/miembro/:idUsuario/:idGrupo', verificarToken,cors(corsOptionsDelegate), (req, res) => {
    const { idUsuario, idGrupo } = req.params;
    const query = "DELETE FROM miembro WHERE ? = idUsuario AND ? = idGrupo";
    mysqlConnection.query(query, [idUsuario, idGrupo], (err, rows) => {
        if(!err){
            if(rows.affectedRows == 0){
                res.json({Status: 'No existe el miembro del grupo '+idGrupo});
            }
            else{
                res.json({Status: 'Miembro eliminado '});
            }
        } else {
            console.log(err);
        }
    })
});

router.delete('/miembro/:id', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    const {id } = req.params;
    const query = "DELETE FROM miembro WHERE ? = idGrupo";
    mysqlConnection.query(query, [id], (err, rows) => {
        if(!err){
            if(rows.affectedRows == 0){
                res.json({Status: 'No existe el grupo ' + id});
            }
            else{
                res.json({Status: 'Miembros del grupo '+id+' eliminados '});
            }
        } else {
            console.log(err);
        }
    })
});

router.get('/pendiente/grupo/:id', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM usuario AS t1 INNER JOIN pendiente AS t2 WHERE t1.nombre = t2.idUsuario AND t2.idGrupo = ?', [id],  (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.post('/pendiente', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    const { idUsuario, idGrupo} = req.body;
    const query = "INSERT INTO pendiente (idUsuario, idGrupo) VALUES (?, ?)";
    mysqlConnection.query(query, [idUsuario, idGrupo], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Pendiente guardado'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/pendiente/:idUsuario/:idGrupo', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    const { idUsuario, idGrupo } = req.params;
    const query = "DELETE FROM pendiente WHERE ? = idUsuario AND ? = idGrupo";
    mysqlConnection.query(query, [idUsuario, idGrupo], (err, rows) => {
        if(!err){
            if(rows.affectedRows == 0){
                res.json({Status: 'No existe el pendiente ' + idUsuario + ' '+ idGrupo});
            }
            else{
                res.json({Status: 'Pendiente eliminado ' + idUsuario + ' '+ idGrupo});
            }
        } else {
            console.log(err);
        }
    })
});

router.delete('/pendiente/:id', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    const {id } = req.params;
    const query = "DELETE FROM pendiente WHERE ? = idGrupo";
    mysqlConnection.query(query, [id], (err, rows) => {
        if(!err){
            if(rows.affectedRows == 0){
                res.json({Status: 'No existe el grupo ' + id});
            }
            else{
                res.json({Status: 'Pendientes del grupo '+id+' eliminados '});
            }
        } else {
            console.log(err);
        }
    })
});

module.exports = router;

function verificarToken(req, res, next) {
    console.log(req.headers);
    if (!req.headers.authorization) {
        console.log("primer if");
        return res.status(401).send('Solicitud no autorizada');
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        console.log("segundo if");
        return res.status(401).send('Solicitud no autorizada');
    }
    const datos = jwt.verify(token, secretKey)
    req.userId = datos._id;
    next();
}