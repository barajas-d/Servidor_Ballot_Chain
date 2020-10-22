const mysqlConnection = require('./dataBase');
const { query } = require('express');

function registrarValidador(peerId){
    const query = 'insert into validador(peerID) values (?)' //where isValidador = false;
    mysqlConnection.query(query, [peerId], (err, rows) => {
        if(!err){
            console.log('registrado en dataBase');
        }
        else{
            console.log(err);
            console.log('error en dataBase');
        }
    });
}


function eliminarValidador(peerId){
    const query = 'delete from validador where peerID = ?';
    mysqlConnection.query(query, [peerId], (err, rows) => {
        if(!err){
            console.log('eliminado de dataBase');
        }
        else{
            console.log('error en dataBase');
        }
    });
}

function eliminarValidadores() {
    const query = "DELETE from validador";
    return new Promise((resolve, reject) => {mysqlConnection.query(query, (err, rows) => {
        if(!err){
            resolve(true);
        }
        else{
            reject(false);
        }
    })});
}

exports.registrarValidador = registrarValidador;
exports.eliminarValidador = eliminarValidador;
exports.eliminarValidadores = eliminarValidadores;