const mysqlConnection = require('./dataBase');
const { query } = require('express');

function registrarValidador(peerId){
    const query = 'insert into validador(peerID) values (?)'
    mysqlConnection.query(query, [peerId], (err, rows) => {
        if(!err){
            console.log('registrado en dataBase');
        }
        else{
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

exports.registrarValidador = registrarValidador;
exports.eliminarValidador = eliminarValidador;