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

router.get('/', function (req, res) {
    var result = new Array();
    var cnt = 0;
    if (req.session.user) {
        console.log('Main 접속');

        pool.getConnection(function (err, connection) {

            var strsql = "SELECT * FROM notice WHERE S_no IN (SELECT O_no FROM course_registration WHERE student_ID = ?) LIMIT 5";

            connection.query(strsql, req.session.user.id, function (err, rows) {
                if (err) console.error(err);

                var sql = "select * from course_registration where student_ID = ?";
                connection.query(sql, req.session.user.id, function (err, rows1) {
                    if (err) console.error(err);

                    var len = rows1.length;
                    sql2 = "select start_time, lecture_time, day_of_week, subject_name from opening_subject natural join lecture_time natural join subject where O_no = ?";
                    for (var i = 0; i < len; i++) {
                        connection.query(sql2, rows1[i].O_no, function (err2, rows2) {
                            if (err2) console.error(err2);
                            result[cnt++] = rows2;
                            if (cnt == len) {
                                var context = { userid: req.session.user.id, rows1: rows1, result: result, rows: rows};

                                res.render('Main', context);
                                connection.release();
                            }
                        })
                    }
                })


            })

        })

    } else {
        var context = { userid: 'No_One' };
        res.render('Main', context);
    }

});

module.exports = router;