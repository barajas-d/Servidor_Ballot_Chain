const express = require('express');
const cors = require('cors');
const router = express.Router();
const crypto = require('crypto');
const cryptoUpdateMd5 = "ballot_chain";
const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');
const jwt = require('jsonwebtoken');
const cifrado = require('../cifrado');

const secretKey = '123456789'
let aux ;

router.get('/votacion', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    mysqlConnection.query('SELECT * FROM votacion', (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.get('/votacion/:id', verificarToken, cors(corsOptionsDelegate), (req, res) => {
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

router.get('/votar/:id', verificarToken, cors(corsOptionsDelegate), async (req, res) => {
    const id = +req.params.id;
    //Ver si usuario está autorizado para votar
    const nombreUsuario = req.userId;
    const usuarioEsValido = false;
    try {
        votacionesAutorizadas = await buscarParticipanteUsuario(nombreUsuario, id);
    } catch (error) { 
        res.json('error');
        return;
    }
    
    //Solicitar info voto
    if(votacionesAutorizadas !== 'notAuthorized'){    
        mysqlConnection.query('SELECT * FROM votacion WHERE id = ?', [id],  (err, rows, fields) => {
            if(!err){
                res.json(rows[0]);
            }
            else{
                console.log('error en dataBase');
                res.json({nombre: undefined});
            }
        })
    }else
    {
        res.json({nombre: undefined});
    }
    
});

function buscarParticipanteUsuario(nombreUsuario, id){
    return new Promise ((resolve, reject) => {
        mysqlConnection.query('select nombre, idVotacion, votosDisponibles from participante where nombre =? and idVotacion = ?', [nombreUsuario, id],  (err, rows, fields) => {
            if(!err){
                if(rows.length > 0){
                    if(rows[0].votosDisponibles == 1){
                        resolve(rows);
                    }else
                    {
                        reject('notAuthorized');
                    }
                }
                else{
                    reject('notAuthorized');
                }
            }
            else{
                reject('notAuthorized');
            }
        })
    }) 
}
router.post('/votacionAdd', verificarToken, cors(corsOptionsDelegate), (req, res) => {

    console.log('entro');
    const { titulo, autor, fechaInicio, fechaLimite, tipoDeVotacion, descripcion, votos, opciones, participantes} = req.body;
    const query = "INSERT INTO votacion (titulo, autor, fechaInicio, fechaLimite, tipoDeVotacion, descripcion, votos) values (?, ?, ?, ?, ?, ?, ?);";
    const queryParticipante = "INSERT INTO participante (idVotacion, nombre) VALUES (?, ?);";
    const queryOpcion = "INSERT INTO opcion (descripcion, nombre, votacion) VALUES (?, ?, ?);";
    const querySeudonimo = "INSERT INTO seudonimo (idVotacion, alias) VALUES (?, ?)";
    const deleteVotacion = "DELETE FROM votacion WHERE votacion.id = ?;";
    let error = false;
    
    mysqlConnection.query(query, [titulo, autor, fechaInicio, fechaLimite, tipoDeVotacion, descripcion, votos], (err, rows, fields) => {
        if(!err) {

            let idVotacion = rows["insertId"];
            let i = 0;
            participantes.forEach(element => {
                console.log("Participante: " + element);
                mysqlConnection.query(queryParticipante, [rows["insertId"], element], (errParticipante, rowsParticipante, fieldsParticipante) => {
                    if(errParticipante){
                        this.error = true;
                    }
                });
                alias = cifrado.encrypt(new Date().getTime().toString()+""+i);
                mysqlConnection.query(querySeudonimo, [idVotacion, alias], (errParticipante, rowsParticipante, fieldsParticipante) => {
                    if(errParticipante){
                        this.error = true;
                    }
                });
                i++;
            });

            opciones.forEach(element => {
                console.log("Opcion: " + element['nombre'] + " " + element['descripcion']);
                mysqlConnection.query(queryOpcion, [element['descripcion'], element['nombre'], rows["insertId"]], (errOpcion, rowsOpcion, fieldsOpcion) => {
                    if(errOpcion){
                        this.error = true;
                    }
                });
            });


                
        }else {
            this.error = true;
        }
        if(this.error){
            res.json({Status: 'Error al crear la votacion', Error: true});
            mysqlConnection.query(deleteVotacion, (err, rows, fields) => {});
        }
        else{
            res.json({Status: "Votacion creada con exito", Id: rows["insertId"], Error:false});
            mysqlConnection.query("commit");
        }
    });
});


router.put('/votacionPut', verificarToken, cors(corsOptionsDelegate), (req, res) => {
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

router.delete('/votacionDelete', verificarToken, cors(corsOptionsDelegate), (req, res) => {
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

router.get('/votacionAutor/:nombre', verificarToken, cors(corsOptionsDelegate), (req, res) => {
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

//Visualizar
/* router.get('/votacionAutorVis/:nombre', verificarToken, cors(corsOptionsDelegate), (req, res) => {
    const { nombre } = req.params;
    mysqlConnection.query('SELECT * FROM votacion WHERE autor = ?', [nombre],  (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log(err);
        }
    })
}); */

module.exports = router;
