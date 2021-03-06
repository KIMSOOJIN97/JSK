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
    console.log('메지시전송 성공');
    
    if(req.session.user) {

        var roomnum = req.body.roomno;
        var sender = req.session.user.id;
        var chatcontent = req.body.content;
        
        pool.getConnection(function(err, connection){
            var strsql = "insert into chatcontent (chatroom_ID, chatter, chatcontent) values (?,?,?)";
        
            connection.query(strsql, [roomnum, sender, chatcontent], function(err, rows) {
                if(err) console.error(err);
                connection.release();
            });

        });
    }
    else{
        res.redirect('/Login');
    }
});

module.exports = router;
