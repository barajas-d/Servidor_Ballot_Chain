const express = require('express');
const cors = require('cors');
const router = express.Router();
const mysqlConnection = require('../dataBase');
const corsOptionsDelegate = require('../cors');
const jwt= require('jsonwebtoken')


const secretKey= '123456789'

router.post('/iniciarSesion', cors(corsOptionsDelegate), (req, res) => {
    const { nombre, contrasena} = req.body;
    mysqlConnection.query('SELECT * FROM usuario WHERE nombre = ? AND contrasena = ?', 
        [nombre, contrasena],(err, rows) => {
        if(!err){
            const token = jwt.sign({_id: nombre},secretKey);
            if(rows.length >= 1)
            {
                res.json({Status:"sesion iniciada",token});
            }
            else
            {
                res.json({Status:"no hay cuentas asi"})
            }
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.get('/usuario', cors(corsOptionsDelegate), (req, res) => {
    mysqlConnection.query('SELECT * FROM usuario', (err, rows) => {
        if(!err){
            res.json(rows);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.get('/usuario/:nombre', cors(corsOptionsDelegate), (req, res) => {
    const { nombre } = req.params;
    mysqlConnection.query('SELECT * FROM usuario WHERE nombre = ?', [nombre],  (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        }
        else{
            console.log(err);
        }
    })
});

router.put('/usuarioPut/:nombreId', cors(corsOptionsDelegate), (req, res) => {
    const { nombreId } = req.params;
    const { nombre, saldo, correo } = req.body;
    const query = "UPDATE usuario SET nombre = ?, saldo = ?, correo = ? WHERE nombre = ?";
    mysqlConnection.query(query, [nombre, saldo, correo, nombreId], (err, rows, fields) => {
        if(!err){
            if(rows.affectedRows == 0){
                res.json({Status: 'No existe el usuario ' + nombre});
            }
            else{
                res.json({Status: 'Usuario actualizado ' + nombre});
            }
        } else {
            console.log(err);
        }
    });
});

router.post('/usuarioAdd', cors(corsOptionsDelegate), (req, res) => {

    console.log("llegue----------------------------------------------------");
    console.log(req.body);
    console.log("----------------------------------------------------------")
    const {  nombre, correo, contrasena } = req.body;
    const token = jwt.sign({_id: nombre},secretKey);
    const query = "INSERT INTO usuario ( nombre, correo, contrasena ) VALUES (?, ?, ?)";
    mysqlConnection.query(query, [nombre, correo, contrasena], (err, rows, fields) => {
        if(!err){

            res.json({Status: 'usuario guardado', token});
        } else {
            console.log(err);
        }
    });
});




module.exports = router;
router.get('/privado', verificarToken,cors(corsOptionsDelegate), (req, res) => {
    console.log("id del usuario (por ahora es el nombre): "+req.userId);
    res.json({
        Status: "Información privada que posiblemente te lleve a la carcel D:"
    })
});

router.get('/publico', cors(corsOptionsDelegate), (req, res) => {
    res.json({
        Status: "Información Family Friendly para que puedas ganar mas plata en youtubi ;v"
    })
});

function verificarToken(req, res, next)
{
    console.log(req.headers.authorization);
    if(!req.headers.authorization)
    {
        return res.status(401).send('Solicitud no autorizada');
    }
    const token = req.headers.authorization.split(' ')[1];
    if(token === 'nul')
    {
        return res.status(401).send('Solicitud no autorizada');
    }
    //console.log('token: '+ token)

    const datos= jwt.verify(token, secretKey)
    //console.log(datos);
    req.userId= datos._id;
    next();

}