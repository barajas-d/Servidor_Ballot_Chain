const mysqlConnection = require("../dataBase");
const cifrado = require('../cifrado');
const sha512 = require('js-sha512');

function obtenerSeudonimos(idVotacion){
    const query = 'SELECT * FROM seudonimo WHERE idVotacion = ? AND disponible = ?';
    return new Promise((resolve, reject) => {
        mysqlConnection.query(query, [idVotacion, true], (err, rows) => {
            if(!err){
                resolve(rows);
            }
            else{
                console.log(err);
                reject(null);
            }
        });
    });
}

function inhabilitarSeudonimo(id){
    const query = 'UPDATE seudonimo SET disponible = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        mysqlConnection.query(query, [false, id], (err, rows) => {
            if(!err){
                resolve();
            }
            else{
                console.log(err);
                reject(null);
            }
        });
    });
}

async function restarVotoParticipante(nombre, idVotacion){
    try {
        let votosDisponibles = await obtenerVotos(nombre, idVotacion);
        if (votosDisponibles > 0){
            await restarVoto(votosDisponibles, nombre, idVotacion);
        }
    } catch (error) {
        console.log(error)
    }
}

function restarVoto(votosDisponibles, nombre, idVotacion){
    const query = 'UPDATE participante SET votosDisponibles = ? WHERE nombre = ? AND idVotacion = ?';
    return new Promise((resolve, reject) => {
        mysqlConnection.query(query, [votosDisponibles - 1, nombre, idVotacion], (err, rows) => {
            if(!err){
                resolve();
            }
            else{
                console.log(err);
                reject(null);
            }
        });
    });
}

async function obtenerVotos(nombre, idVotacion){
    try {
        return await obtenerVotosDisponibles(nombre, idVotacion);
    } catch (error) {
        console.log(error);
    }
    return null;
}

function obtenerVotosDisponibles(nombre, idVotacion){
    const query = 'SELECT * FROM participante WHERE nombre = ? AND idVotacion = ?';
    return new Promise((resolve, reject) => {
        mysqlConnection.query(query, [nombre, idVotacion], (err, rows) => {
            if(!err){
                console.log('votosDisponibles', rows);
                resolve(rows[0]['votosDisponibles']);
            }
            else{
                console.log(err);
                reject(null);
            }
        });}
    );
}

function obtenerSeudonimo(idVotacion, alias){
    const query = 'SELECT * FROM seudonimo WHERE idVotacion = ? AND alias = ?';
    return new Promise((resolve, reject) => {
        mysqlConnection.query(query, [idVotacion, alias], (err, rows) => {
            if(!err){
                resolve(rows);
            }
            else{
                console.log(err);
                reject(null);
            }
        });
    });
}

function insertarSeudonimo(idVotacion, alias){
    const query = 'INSERT INTO seudonimo (idVotacion, alias) VALUES (?, ?)';
    return new Promise((resolve, reject) => {
        mysqlConnection.query(query, [idVotacion, alias], (err, rows) => {
            if(!err){
                resolve(rows);
            }
            else{
                console.log(err);
                reject(null);
            }
        });
    });
}

async function calcularSeudonimo(idVotacion, idVoto) {
    console.log('idVotacion-------', idVotacion);
    console.log('idVoto--------', idVoto);
    const alias = sha512.create().update(idVotacion + idVoto).hex();
    console.log('Tamaño--', alias.length);
    const resultados = await obtenerSeudonimo(idVotacion, alias);
    if (resultados.length === 0){
        await insertarSeudonimo(idVotacion, alias);
    }
    return alias;
}

exports.obtenerSeudonimos = obtenerSeudonimos;
exports.inhabilitarSeudonimo = inhabilitarSeudonimo;
exports.restarVotoParticipante = restarVotoParticipante;
exports.obtenerVotos = obtenerVotos;
exports.calcularSeudonimo = calcularSeudonimo;