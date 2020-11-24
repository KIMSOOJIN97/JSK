var http = require('http');
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

router.post('/', function(req, res){
    console.log('Login Button 클릭');
    
    var user_id = req.body.id || req.query.id;
    var user_password = req.body.password || req.query.password;
    console.log('ID : ' + user_id + ', Password : ' + user_password);
    
    var strsql = "select * from users where user_id = '" + user_id + "' AND user_password = '" + user_password + "'";
    
    var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rkdvnd52',
    database: 'face_recognition'
    });
    connection.connect()
    
    connection.query(strsql, function(err, rows, fields) {
        if (err) throw err;

        if(rows.length > 0) {
            console.log('로그인 성공');
            
            req.session.user = {
                id:user_id,
                authorized:true
            };
            res.redirect('/Main');
            
        } else {
            console.log('일치하는 사용자 없음.');
            res.redirect('/Main');
        }
    });
    connection.end();
});

module.exports = router;