var express = require('express');
var mysql = require('mysql');
var config = require('../../config');

var pool = mysql.createPool({
	connectionLimit: 5,
	host: 'localhost',
	user: 'root',
	database: 'jsk_db',
    password: config.db_info.password,
    port: config.db_info.port
});

var router = express.Router();

router.get('/', function(req, res, next){
        
    if(req.session.user){

        var classname = req.body.classname || req.query.classname;
        console.log('공지사항 쓰기화면 접속 ' + req.session.user.id);

        var context = {classname};
        res.render('ZNoticeWriting', context);
    } else {
        console.log('로그인된 사용자 없음');
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }
});

router.post('/', function(req, res, next){
        
    if(req.session.user){
        console.log('공지사항 쓰기 성공');

        var classname = req.body.classname || req.query.classname;
        var title = req.body.title || req.query.title;
        var content = req.body.content || req.query.content;
        var professor_ID = req.session.user.id;


        pool.getConnection(function(err, connection){
            var strsql = "SELECT S_no FROM subject WHERE subject_name = '"+ classname +"'";
            connection.query(strsql, function(err, rows1){
                if(err) console.error(err);
                
                strsql = "INSERT INTO notice (professor_ID, S_no, title, content) values (?,?,?,?)"
                connection.query(strsql, [professor_ID, rows1[0].S_no, title, content], function(err, rows2){
                    if(err) console.error(err);

                    res.redirect('/ZClass');

                    connection.release();
                });
            });
        });





    } else {
        console.log('로그인된 사용자 없음');
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }
});

module.exports = router;