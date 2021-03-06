var http = require('http');
var express = require('express');
var router = express.Router();
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
        
    var boardno = req.body.boardno || req.query.boardno;
    console.log(boardno);

    if(req.session.user){

        pool.getConnection(function(err, connection){

            var strsql = "SELECT * FROM notice where Notice_no = ?";
            connection.query(strsql, boardno, function(err, rows){
                if(err) console.error(err);
                
                var strsql = "SELECT * FROM Professor where professor_ID = ?";
                connection.query(strsql, [req.session.user.id] , function(err, rows2){
                    if(err) console.error(err);
                    
                    var context = {userid:req.session.user.id, rows:rows,rows2:rows2,boardno: boardno};
                    res.render('ZNoticeContent', context);
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

