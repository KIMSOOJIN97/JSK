var http = require('http');
var express = require('express');
var mysql = require('mysql');
var socketio = require('socket.io');

var router = express.Router();

var pool = mysql.createPool({
	connectionLimit: 5,
	host: 'localhost',
	user: 'root',
	database: 'jsk_db',
    password: 'rkdvnd52',
    port: 3300
});

router.post('/', function(req, res){
    var roomnumber = req.body.chatroom_ID;
    console.log('ChatRoom 접속 ' + roomnumber);

    if(req.session.user) {

        pool.getConnection(function(err, connection){
            var strsql1 = 'select * from chatroom where chatroom_ID = ?';
            var strsql2 = 'select * from chatcontent where chatroom_ID = ?';        


            connection.query(strsql1, [roomnumber], function(err, rows1) {
                if(err) console.error(err);
                
                connection.query(strsql2, [roomnumber], function(err2, rows2) {
                    if(err2) console.error(err2);
                    
                    var context = {room_info:rows1, content_info:rows2, own:req.session.user.id};
                    res.render('ChatRoom', context);
                    connection.release();
                });
            });


        });
        
    } else {
        res.redirect('/Login');
    }
});

module.exports = router;
