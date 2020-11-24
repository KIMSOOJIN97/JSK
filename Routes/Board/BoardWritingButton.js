var http = require('http');
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

router.post('/', function(req, res){
    console.log('Board 글 작성 완료');

    var title = req.body.title || req.query.title;
    var content = req.body.content || req.query.content;
    var writer = req.session.user.id;
        
    var strsql = "insert into board (b_title, b_note, b_writer) values ('" + title + "', '" + content + "', '" + writer + "')";
    
    var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rkdvnd52',
    database: 'face_recognition'
    });
    connection.connect()
    
    connection.query(strsql, function(err, rows, fields) {
        if (err) throw err;
        
        connection.end();
    });
    
    
    res.redirect('/Board');
    
});

module.exports = router;