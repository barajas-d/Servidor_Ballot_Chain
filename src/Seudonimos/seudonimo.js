const mysqlConnection = require("../dataBase");

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
                console.log('Deshabilitando el seudonimo con id', id);
                resolve(rows[0]);
            }
            else{
                console.log(err);
                reject(null);
            }
        });
    });
}

exports.obtenerSeudonimos = obtenerSeudonimos;
exports.inhabilitarSeudonimo = inhabilitarSeudonimo;