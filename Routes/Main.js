var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'jsk_db',
    password: 'rkdvnd52',
    port: 3300
});

router.get('/', function (req, res) {
    var result = new Array();
    var cnt = 0;
    if (req.session.user) {
        console.log('Main 접속');
        pool.getConnection(function (err, connection) {
            var sql = "select * from course_registration where student_ID = ?";
            console.log(req.session.user.id);
            connection.query(sql, req.session.user.id, function (err, rows1) {
                if (err) console.error(err);
                console.log(rows1);
                var len = rows1.length;
                sql2 = "select start_time, lecture_time, day_of_week, subject_name from opening_subject natural join lecture_time natural join subject where O_no = ?";
                for(var i =0; i < len; i++){
                    connection.query(sql2, rows1[i].O_no, function (err2, rows2) {
                        if (err2) console.error(err2);
                        result[cnt++] = rows2;
                        if(cnt == len){
                            var context = { userid: req.session.user.id, rows1: rows1, result: result };
                            console.log(result);
                            res.render('Main', context);
                            connection.release();
                        }
                    })
                }
            })
            
        })
    } else {
        var context = { userid: 'No_One' };
        res.render('Main', context);
    }

});

module.exports = router;