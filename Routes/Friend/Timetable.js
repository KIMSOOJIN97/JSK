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

router.post('/', function(req, res){

    console.log('친구시간표 접속');
    if(req.session.user == undefined){
        res.redirect('/Login');
        return;
    }

    var aa = JSON.parse(JSON.stringify(req.body)); 
    var checkedmem = Object.keys(aa).length;
    
    if(checkedmem != 1) {
        console.log('한명의 시간표를 확인하세요.');
        res.send("<script>alert('한명의 시간표를 확인하세요.');history.back();</script>");
        return;
    }

    var chatusers = [];
    for (var key in aa) {
        chatusers.push(key);  
    }
    console.log("체크된 사용자: " + chatusers);
    console.log("체크된 사용자 수: " + chatusers.length);

    var result = new Array();
    var cnt = 0;

    pool.getConnection(function (err, connection) {
        var sql = "select * from course_registration where student_ID = ?";
        console.log(chatusers);
        connection.query(sql, chatusers, function (err, rows1) {
            if (err) console.error(err);

            if(rows1 == ""){
                console.log('친구의 수강신청 정보가 없습니다.');
                res.send("<script>alert('친구의 수강신청 정보가 없습니다.');history.back();</script>");
            }

            var len = rows1.length;
            sql2 = "select start_time, lecture_time, day_of_week, subject_name from opening_subject natural join lecture_time natural join subject where O_no = ?";
            for(var i =0; i < len; i++){
                connection.query(sql2, rows1[i].O_no, function (err2, rows2) {
                    if (err2) console.error(err2);

                    result[cnt++] = rows2;
                    if(cnt == len){
                        var context = { userid: req.session.user.id, rows1: rows1, result: result, friend_ID: chatusers };

                        res.render('Timetable', context);
                        connection.release();
                    }
                })
            }
        })
        
    })

});

module.exports = router;