var http = require('http');
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

router.post('/', function(req, res){
    console.log('MypageCheck 접속');

    if(req.session.user) {                
        var imgname = req.body.face_img;        
        
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'rkdvnd52',
            database: 'face_recognition'
        });
        connection.connect()

        var strsql = "select * from face_result where cause_image = '" + imgname + "'";
        
        connection.query(strsql, function(err, rows, fields) {
            if (err) throw err;
            
            var loginid = req.session.user.id;
            var context = {rows, loginid};

            if(rows[0]==undefined)
                res.render('MypageCheckEmpty');
            else
                res.render('MypageCheck', context);
            
            connection.end();
        });
        
    } else {
        
        var context = {userid:'No_One'};
        res.render('Login', context);
    }
    
});

module.exports = router;