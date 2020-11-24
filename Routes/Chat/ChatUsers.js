var http = require('http');
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

router.post('/', function(req, res){
    console.log('Chat_Users 접속');
    
    if(req.session.user){
        var logineduser = "'" + req.session.user.id + "'";
        var strsql = "select * from users where not user_id = " + logineduser;
        
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
            
            res.render('ChatUsers', context);
            connection.end();
        });
        
    } else {
        res.redirect('/Login');
    }

});

module.exports = router;