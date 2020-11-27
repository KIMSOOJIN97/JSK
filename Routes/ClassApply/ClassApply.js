var express = require('express');
var mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit: 5,
	host: 'localhost',
	user: 'root',
	database: 'jsk_db',
    password: '1234',
});

var router = express.Router();

router.get('/', function(req, res){
        
    if(req.session.user){
        console.log('수강신청 접속');

        pool.getConnection(function(err, connection){

            var strsql = "select * from opening_subject";
            connection.query(strsql, function(err, rows1){
                if(err) console.error(err);
            
                console.log(rows1);

                strsql = "select * from subject where S_no in (select S_no from opening_subject)"
                connection.query(strsql, function(err, rows2){

                var context = {rows1:rows1, rows2:rows2};
                console.log(rows2);

                res.render('ClassApply', context);
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
        var aa = JSON.parse(JSON.stringify(req.body));
        var checkedsubject = Object.keys(aa).length;

        var subject = [];
        for(var key in aa){
            subject.push(key);
        }
        console.log("체크된 과목: " + subject);
        console.log("체크된 과목 수: "+ subject.length);

        pool.getConnection(function(err, connection){

            var strsql = "SELECT COUNT(*) AS num FROM course_registration WHERE student_ID = ?;";
            connection.query(strsql, [req.session.user.id], function(err, rows){
                if(err) console.error(err);

                console.log("신청한 과목 수: " + rows[0].num);
                var a123 = rows[0].num + subject.length;
                console.log("총 과목 수: " + a123);
                if(rows[0].num + subject.length > 7){
                    res.send("<script>alert('21학점 이하로 수강하세요!!');history.back();</script>");
                }
                else{
                    strsql = "insert into course_registration (student_ID, O_no, personnel) values (?,?,?)";
            
                    for(var i=0; i<subject.length; i++){
                        connection.query(strsql, [req.session.user.id, subject[i], 1], function(err, rows) {
                            if(err) console.error(err);
                        });
                    }
                    res.send("<script>alert('수강신청 완료!!');history.back();</script>");
                }
                connection.release();
            });
        });
    } else {
        console.log('로그인된 사용자 없음');
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }
});

module.exports = router;