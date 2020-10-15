const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'ballot_chain',
    port: 3306
});

mysqlConnection.connect(function (err){
    if(err) {
        console.log(err);
        return;
    }
    else{
        console.log('Db is connected');
    }
});


module.exports = mysqlConnection;