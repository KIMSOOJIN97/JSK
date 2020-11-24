var http = require('http');
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

router.get('/', function(req, res){
    console.log('Board 접속');
    
    var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rkdvnd52',
    database: 'face_recognition'
    });
    connection.connect();
    
    connection.query('select * from board', function(err, rows, fields) {
        if (err) throw err;

        var context = {rows};

        
        res.render('Board', context);
        connection.end();
        
    });
});

module.exports = router;