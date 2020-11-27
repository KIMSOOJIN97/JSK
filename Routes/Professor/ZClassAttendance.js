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

router.get('/', function(req, res){

    var classname = req.query.classname||req.body.classname;

    if(req.session.user){
        pool.getConnection(function(err, connection){

            var sql = "select * from Student where student_ID in (select student_ID from course_registration WHERE O_no=?)"
            connection.query(sql, classname, function(err, rows1){
                if(err) console.error(err);
                var context = {rows1:rows1, classname :classname };

                res.render('ZClassAttendance', context);
                connection.release();
            })
        })
    } else {
        console.log('로그인된 사용자 없음');
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }
});


router.post('/', function(req, res){
    if(req.session.user){

        var week = req.body.week;
        var aa = JSON.parse(JSON.stringify(req.body));
        var attend = Object.entries(aa);
        var len = attend.length;


        pool.getConnection(function(err, connection){

            for( i=0;i<len;i++){

                var ID = attend[i][0];
                var check = attend[i][1];

                if(ID=="week")  continue;
                
                var sql = "INSERT INTO Attendance (Week,Attendance_check,student_ID,O_no) VALUES(?,?,?,?)";

                connection.query(sql,[ week, check, ID, classname],function(err, result){
                    if(err) console.error(err);
                })
            }
            res.send("<script>alert('출석체크 완료!!');history.back();</script>");
        });

    }else {
        console.log('로그인된 사용자 없음');
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }
            
});

module.exports = router;