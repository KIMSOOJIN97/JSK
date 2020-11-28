var express = require('express');
var mysql = require('mysql');
var config = require('../config');

var pool = mysql.createPool({
	connectionLimit: 5,
	host: 'localhost',
	user: 'root',
	database: 'jsk_db',
    password: config.db_info.password,
    port: config.db_info.port
});

var router = express.Router();
var classname;

router.get('/', function(req, res){

    classname = req.query.classname||req.body.classname;

    if(req.session.user){
        pool.getConnection(function(err, connection){
            
            var sql1 = "select subject_name from subject where S_no IN ( select S_no from opening_subject where O_no = ?)";
            connection.query(sql1, classname, function(err, subject_name){
                if(err) console.error(err);
                console.log(subject_name);

                var sql = "select * from Attendance where student_ID =? AND O_no = ? ORDER BY Week ASC";
                connection.query(sql, [req.session.user.id,classname], function(err, rows1){
                    if(err) console.error(err);
                    var result = {rows1:rows1, subject_name :subject_name,userid: req.session.user.id };
    
                    res.render('ClassAttendance', result);
                    connection.release();
                })
            })

           
        })
    } else {
        console.log('로그인된 사용자 없음');
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }
});


router.post('/', function(req, res){
    if(req.session.user){

        console.log("출석체크 전송");

    }else {
        console.log('로그인된 사용자 없음');
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }
            
});

module.exports = router;