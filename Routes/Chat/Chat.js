var http = require('http');
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

router.get('/', function(req, res){
    console.log('Chat 접속');
   
    if(req.session.user){
        
    var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rkdvnd52',
    database: 'face_recognition'
    });
    connection.connect();

        connection.query('select * from chatroom', function(err, rows, fields) {
            if (err) throw err;

            var context = {rows};

            res.render('Chat', context);
            connection.end();

        });
        
    } else {
        res.redirect('/Login');
    }

});

module.exports = router;