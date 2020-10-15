const express = require('express');
const cors = require('cors');
const router = express.Router();
const crypto = require('crypto');
const cryptoUpdateMd5 = "ballot_chain";
const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');
const jwt = require('jsonwebtoken');

const secretKey = '123456789'

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

router.post('/votacionAdd', verificarToken, cors(corsOptionsDelegate), (req, res) => {

    console.log('entro');
    function transformarFecha(fecha){
        let fechaSalida = "";
        fechaSalida = fecha['year'] + '-' + fecha['month'] + '-' + fecha['day'];
        return fechaSalida;
    }

    const { titulo, autor, fechaInicio, fechaLimite, tipoDeVotacion, descripcion, votos, opciones, participantes} = req.body;
    const query = "INSERT INTO votacion (titulo, autor, fechaInicio, fechaLimite, tipoDeVotacion, descripcion, votos) values (?, ?, ?, ?, ?, ?, ?);";
    
    opciones.forEach(element => {
        console.log("Opcion: " + element['nombre'] + " " + element['descripcion']);
    });
    
    participantes.forEach(element => {
        console.log("Participante: " + element);
    });
    mysqlConnection.query(query, [titulo, autor, transformarFecha(fechaInicio), transformarFecha(fechaLimite), tipoDeVotacion, descripcion, votos], (err, rows, fields) => {
        if(!err) {
           /* if(cantCredenciales == undefined || cantCredenciales == 0){
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
                }*/
                res.json({Status: "Votacion creada con exito", Id: rows["insertId"], Error:false});
                console.log("funciona");
                //}
        } else {
            res.json({Status: 'Error al crear la votacion', Error: true});
            console.log("no funciona: " + err);

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

module.exports = router;
