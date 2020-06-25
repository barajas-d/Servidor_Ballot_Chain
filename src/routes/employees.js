const express = require('express');
const router = express.Router();

const mysqlConnection = require('../dataBase');



router.get('/funciona/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM employess WHERE id = ?', [id], (err, rows, fields ) => {
        if(!err){
            res.json(rows[0]);
        }
        else{
            console.log('error en dataBase');
        }
    })
});

router.post('/post', (req, res) => {
    const { name, salary } = req.body;
    const query = "INSERT INTO employess (name, salary) VALUES (?, ?)";
    mysqlConnection.query(query, [name, salary], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Employeed Saved'});
        } else {
            console.log(err);
        }
    });
});

router.put('/put', (req, res) => {
    const { id, name, salary } = req.body;
    const query = "UPDATE employess SET name = ?, salary = ? WHERE id = ?";
    mysqlConnection.query(query, [name, salary, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Employeed Update'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/delete', (req, res) => {
    const { id } = req.body;
    const query = "DELETE FROM employess WHERE ? = id";
    mysqlConnection.query(query, [id], (err, rows) => {
        if(!err){
            if(rows.affectedRows == 0){
                res.json({Status: 'No exist employed ' + id});
            }
            else{
                res.json({Status: 'Delete employed ' + id});
            }
        } else {
            console.log(err);
        }
    })
});

module.exports = router;