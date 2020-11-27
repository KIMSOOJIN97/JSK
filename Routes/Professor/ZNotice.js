var express = require('express');
var mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit: 5,
	host: 'localhost',
	user: 'root',
	database: 'jsk_db',
    password: 'rkdvnd52',
    port: 3300
});

var router = express.Router();

router.get('/', function(req, res){
        
    var classname = req.body.classname || req.query.classname;

    if(req.session.user){
        console.log('공지사항 접속 ' + req.session.user.id);

        pool.getConnection(function(err, connection){

            var strsql = "SELECT * FROM notice where S_no = ?";
            connection.query(strsql, [classname], function(err, rows1){
                if(err) console.error(err);


                strsql = "SELECT * FROM subject where S_no = ?";
                connection.query(strsql, [classname], function(err, rows2){
                    if(err) console.error(err);

                    var context = {rows1:rows1, rows2:rows2, classname:classname};
                    res.render('ZNotice', context);
                    connection.release();

                })

            });
        });    
    } else {
        console.log('로그인된 사용자 없음');
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }
});

module.exports = router;