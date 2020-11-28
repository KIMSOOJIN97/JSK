var express = require('express');
var router = express.Router();
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

router.get('/', function (req, res) {
    var result = new Array();
    var cnt = 0;
    if (req.session.user) {
        console.log('성적확인 페이지 접속');
        pool.getConnection(function (err, connection) {
            var sql = "select O_no, student_id, subject_name, Dep_name, subject_division, D_no, credit, grade from complete_list natural join opening_subject natural join subject natural join department where student_id = ?";
            console.log(req.session.user.id);
            connection.query(sql, req.session.user.id, function (err, rows1) {
                if (err) console.error(err);
                console.log(rows1);
                var sql2 = "select student_name from student where student_ID = ?"
                connection.query(sql2, req.session.user.id, function (err2, rows2) {
                    if (err2) console.error(err2);
                    console.log(rows2);
                    var context = { userid: req.session.user.id, rows1: rows1, rows2: rows2};
                    res.render('grade_check', context);
                    connection.release();
                })
            })
        })
    } else {
        var context = { userid: 'No_One' };
        res.render('grade_check', context);
    }
});

module.exports = router;