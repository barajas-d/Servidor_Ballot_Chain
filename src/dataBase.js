const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: 'us-cdbr-east-02.cleardb.com',
    user: 'b5c4a99c0edd86',
    password: 'bb67598e',
    database: 'heroku_bc233808c150328',
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