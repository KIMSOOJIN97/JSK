var http = require('http');
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

router.post('/', function(req, res){
    console.log('Send the message.');
    
    if(req.session.user) {

        var roomnum = req.body.roomno;
        var sender = req.session.user.id;
        var chatcontent = req.body.content;
        
        
        var strsql = "insert into chatcontent (room_no, chat_mem, chat_content) values ('" + roomnum + "', '" + sender + "', '" + chatcontent + "')";

        var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'rkdvnd52',
        database: 'face_recognition'
        });
        connection.connect();


        connection.query(strsql, function(err, rows, fields) {
            if (err) throw err;

            connection.end();        
        });
    }
});

module.exports = router;
