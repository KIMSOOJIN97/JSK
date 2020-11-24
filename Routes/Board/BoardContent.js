var http = require('http');
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

router.post('/', function(req, res){
    console.log('Board_Content 접속');
    
    var strsql = "select * from board where b_no = '" + req.body.boardno + "'";
    
    var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rkdvnd52',
    database: 'face_recognition'
    });
    connection.connect();
    
    connection.query(strsql, function(err, rows, fields) {
        if (err) throw err;

        var context = {rows};
        
        res.render('BoardContent', context);
        connection.end();        
    });
});

module.exports = router;