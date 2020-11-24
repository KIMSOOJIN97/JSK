var http = require('http');
var express = require('express');

var multer = require('multer');
var fs = require('fs');
var path = require('path');

var mysql = require('mysql');


var router = express.Router();

var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, '../../.spyder-py3/1.Face_recog_project/Project/knowns/');                  //파일이 저장되는 공간, 목적지
    },
    filename:function(req, file, callback){
        var extension = path.extname(file.originalname);                //확장자
        var basename = path.basename(file.originalname, extension);     //파일 이름
//        callback(null, basename + Date.now() + extension);              //파일 이름 설정
        
        var userid = req.session.user.id
        var name = req.body.name || req.query.name;
        var age = req.body.age || req.query.age;
        
        callback(null, userid + name + age + extension);
    }
});

var upload = multer({
    storage:storage,            //설정
    limits:{
        files:10,
        fileSize:1024*1024*1024
    }
});


router.post('/', upload.array('photo', 1), function(req, res){
    console.log('UploadButton 클릭');

    var files = req.files;
    if(files.length > 0){
        console.log('사진 업로드 성공');
        
        var userid = req.session.user.id
        var name = req.body.name || req.query.name;
        var age = req.body.age || req.query.age;
        
        var face_file = userid + name + age + path.extname(files[0].originalname);

        var strsql = "insert into face_picture (face_userid, face_name, face_age, face_file) values ('" + userid + "', '" + name + "', '" + age + "', '" + face_file + "')";

        var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'rkdvnd52',
        database: 'face_recognition'
        });
        connection.connect()

        connection.query(strsql, function(err, rows, fields) {
            if (err) throw err;

            var context = {rows};

            console.log("사진 정보 데이터베이스 저장 성공")
            connection.end();
        });
        
        
        
        
        
    } else{
        console.log('파일 없음.');
    }
    
    res.redirect('/Upload');    
});

module.exports = router;





























