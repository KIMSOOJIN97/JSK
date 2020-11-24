var http = require('http');
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

router.post('/', function(req, res){
    console.log('Board Update 완료.');

    var title = req.body.title || req.query.title;
    var content = req.body.content || req.query.content;
    var num = req.body.boardnum;
    
    var strsql = "update board set b_title = '" + title + "', b_note = '" + content + "' where b_no = '" + num + "'"; 
        
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