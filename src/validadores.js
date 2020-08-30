const mysqlConnection = require('./dataBase');

function registrarValidador(peerId){
    query = 'insert into validador(peerID) values (?)'
    mysqlConnection.query(query, [peerId], (err, rows) => {
        if(!err){
            console.log('registrado en dataBase');
        }
        else{
            console.log('error en dataBase');
        }
    });
}

exports.registrarValidador = registrarValidador;