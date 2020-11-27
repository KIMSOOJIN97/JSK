var http = require('http');
var express = require('express');
var mysql = require('mysql');
var fs = require('fs');

var router = express.Router();

router.get('/', function(req, res){
    console.log('Mypage 접속');

    if(req.session.user) {
        
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'rkdvnd52',
            database: 'face_recognition'
        });
        connection.connect()

        var strsql = "select * from face_picture where face_userid = '" + req.session.user.id + "'";
        
        connection.query(strsql, function(err, rows, fields) {
            if (err) throw err;
            
            var loginid = req.session.user.id;
            var context = {rows, loginid};
            
            res.render('Mypage', context);
            connection.end();

        });        
    } else {
        var context = {userid:'No_One'};
        res.render('Main', context);
    }
    
});

module.exports = router;