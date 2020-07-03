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
            console.log(rows[0]);
            res.json(rows[0]);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.post('/grupo', cors(corsOptionsDelegate), (req, res) => {
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

router.delete('/grupo/:id', cors(corsOptionsDelegate), (req, res) => {
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

router.put('/grupo', cors(corsOptionsDelegate), (req, res) => {
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

















router.get('/usuario', cors(corsOptionsDelegate), (req, res) => {//esto es de usuario
    mysqlConnection.query('SELECT * FROM usuario', (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.get('/usuario/:nombre', cors(corsOptionsDelegate), (req, res) => {//esto es de usuario
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



router.get('/miembro/grupo/:id', cors(corsOptionsDelegate), (req, res) => {
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

router.post('/miembro', cors(corsOptionsDelegate), (req, res) => {
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

router.delete('/miembro/:idUsuario/:idGrupo', cors(corsOptionsDelegate), (req, res) => {
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

router.delete('/miembro/:id', cors(corsOptionsDelegate), (req, res) => {
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











router.get('/pendiente/grupo/:id', cors(corsOptionsDelegate), (req, res) => {
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




router.post('/pendiente', cors(corsOptionsDelegate), (req, res) => {
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

router.delete('/pendiente/:idUsuario/:idGrupo', cors(corsOptionsDelegate), (req, res) => {
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

module.exports = router;

