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
        console.log('교수 성적입력 접속');
        var classname = req.body.classname || req.query.classname;

        pool.getConnection(function(err, connection){
            
            var strsql = "SELECT * FROM course_registration WHERE O_no = ?"
            connection.query(strsql, [classname], function(err, rows){
                if(err) console.error(err);

                var context = {userid: req.session.user.id,rows:rows, classname:classname};
                res.render('ZGrade', context);
                connection.release();
            });
        });
    } else {
        console.log('로그인된 사용자 없음');
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }
});



router.post('/', function(req, res, next){
        
    if(req.session.user){
        console.log('교수 성적입력 접속');
        var classname = req.body.classname || req.query.classname;
        var grade = req.body.grade || req.query.grade;
        var aa = classname.split(',');

        console.log(classname);
        console.log(grade);
        console.log(aa[0]);
        console.log(aa[1]);

        pool.getConnection(function(err, connection){
            var strsql = "SELECT * FROM complete_list WHERE O_no = ? AND student_ID = ?";
            connection.query(strsql, [aa[0], aa[1]], function(err, rows1){
                if(err) console.error(err);

                if(rows1 != ""){
                    res.send("<script>alert('이미 성적을 입력했습니다.');history.back();</script>");
                    connection.release();
                }
                else{
                    strsql = "INSERT INTO complete_list (grade, student_ID, O_no) VALUES (?,?,?)";
                    connection.query(strsql, [grade, aa[1], aa[0]], function(err, rows2){
                        if(err) console.error(err);

                        res.redirect('/ZClass');
                        connection.release();
                    });
                }
            });
        });
        
    } else {
        console.log('로그인된 사용자 없음');
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }
});

module.exports = router;