var http = require('http');
var express = require('express');
var mysql = require('mysql');
var socketio = require('socket.io');

var router = express.Router();

router.post('/', function(req, res){
    console.log('[ChatRoom 접속]');
    var roomnumber = req.body.room_no;

    if(req.session.user) {

    var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rkdvnd52',
    database: 'face_recognition'
    });
    connection.connect();

        var strsql1 = 'select * from chatroom where room_no = ' + roomnumber;
        var strsql2 = 'select * from chatcontent where room_no = ' + roomnumber;        
        
        console.log("roomnumber: " + roomnumber);
        
        connection.query(strsql1, function(err, rows, fields) {
            if (err) throw err;            

            connection.query(strsql2, function(err2, rows2, fields2) {
                if (err2) throw err2;
                
                var context = {room_info:rows, content_info:rows2, own:req.session.user.id};

                console.log("rows: " + rows);
                console.log("rows2: " + rows2);
                
                
                res.render('ChatRoom', context);
                connection.end();
                
            });
        });
        
    } else {
        res.redirect('/Login');
    }
});

module.exports = router;
