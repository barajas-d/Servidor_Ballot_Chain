const mysqlConnection = require("../dataBase");

function obtenerSeudonimos(idVotacion){
    const query = 'SELECT * FROM seudonimo WHERE idVotacion = ?';
    const promesa = new Promise();
    mysqlConnection.query(query, [idVotacion], (err, rows) => {
        if(!err){
            promesa.resolve(rows);
        }
        else{
            console.log(err);
            promesa.reject();
        }
    });
    return promesa;
}

exports.obtenerSeudonimos = obtenerSeudonimos;