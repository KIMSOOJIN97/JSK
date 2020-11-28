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
                    res.render('Notice', context);
                    connection.release();

                })

            });
        });    
    } else {
        console.log('로그인된 사용자 없음');
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }
});


router.post('/', function(req, res){
        
    var boardno = req.body.boardno || req.query.boardno;
    var boardinfo = boardno.split(',');

    if(req.session.user){

        pool.getConnection(function(err, connection){

            var strsql = "SELECT * FROM notice where Notice_no = ? AND S_no = ?";
            connection.query(strsql, [boardinfo[0], boardinfo[1]], function(err, rows){
                if(err) console.error(err);

                var context = {rows:rows, N_no:boardinfo[0], S_no:boardinfo[1]};
                res.render('NoticeContent', context);
                connection.release();
            });
        });    
    } else {
        console.log('로그인된 사용자 없음');
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }
});

module.exports = router;