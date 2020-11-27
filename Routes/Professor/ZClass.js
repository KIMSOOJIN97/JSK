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
        console.log('교수 과목조회 접속');

        pool.getConnection(function(err, connection){

            var strsql = "SELECT * FROM opening_subject WHERE O_no IN (SELECT O_no FROM instructor WHERE Professor_ID = ?) ORDER BY O_no;";
            connection.query(strsql, [req.session.user.id], function(err, rows1){
                if(err) console.error(err);
                
                strsql = "SELECT * FROM subject WHERE S_no IN (SELECT S_no FROM opening_subject WHERE O_no IN (SELECT O_no FROM instructor WHERE Professor_ID = ?)) ORDER BY S_no";
                connection.query(strsql, [req.session.user.id], function(err, rows2){
                    if(err) console.error(err);

                    var context = {rows1: rows1, rows2: rows2};
                    res.render('ZClass', context);
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