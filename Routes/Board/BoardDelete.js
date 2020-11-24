var http = require('http');
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

router.post('/', function(req, res){
    console.log('BoardDelete 완료.');
    
    var boardnum = req.body.boardnum;
    
    var strsql = "delete from board where b_no = '" + boardnum + "'";

    var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rkdvnd52',
    database: 'face_recognition'
    });
    connection.connect();
        
    connection.query(strsql, function(err, rows, fields) {
        if (err) throw err;
                
        res.redirect('/Board');
        connection.end();        
    });    
});

module.exports = router;