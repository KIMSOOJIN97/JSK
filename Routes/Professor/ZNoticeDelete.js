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
        
    var boardno = req.body.boardno || req.query.boardno;
    var boardinfo = boardno.split(',');

    if(req.session.user){

        pool.getConnection(function(err, connection){

            var strsql = "DELETE FROM notice where Notice_no = ? AND S_no = ?";
            connection.query(strsql, [boardinfo[0], boardinfo[1]], function(err, rows){
                if(err) console.error(err);

                res.redirect('/ZClass');
                connection.release();
            });
        });    
    } else {
        console.log('로그인된 사용자 없음');
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }
});

module.exports = router;