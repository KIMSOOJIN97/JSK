var express = require('express');
var mysql = require('mysql');
var config = require('../../config');

var pool = mysql.createPool({
	connectionLimit: 5,
	host: 'localhost',
	user: 'root',
	database: 'jsk_db',
    password: config.db_info.password,
    port: config.db_info.port,
    multipleStatements : true

});

var router = express.Router();

router.get('/', function(req, res){
        
    if(req.session.user){

        pool.getConnection(function(err, connection){

            var strsql = "SELECT * FROM Professor where professor_ID = ?";
            connection.query(strsql, [req.session.user.id], function(err, rows1){
                if(err) console.error(err);

                var dep = "SELECT * FROM Department WHERE D_no in (SELECT D_no FROM Professor where professor_ID = ?)"
                connection.query(dep, [req.session.user.id], function(err, rows2){

                    res.render('ZMypage', {rows1:rows1,userid: req.session.user.id,rows2:rows2});
                    connection.release();
                })
            })
        });  

    } else {
        console.log('로그인된 사용자 없음');
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }
});


router.post('/', function(req, res){

    var password = req.body.passwd;
    var email = req.body.email;
    var address = req.body.address;
    var address2 = req.body.address2;
    var phone_number = req.body.phone;

    if(address2 != "") address = address+" "+address2;
    if(req.session.user){


        pool.getConnection(function(err, connection){

            if(password != ""){
                var sql1 = "update Professor set password=? where professor_ID=?";
                connection.query(sql1,[password,req.session.user.id],function(err,fields){
                    if(err) console.error(err);
                })
            }
            if(email != ""){
                var sql1 = "update Professor set email=? where professor_ID=?";
                connection.query(sql1,[email,req.session.user.id],function(err,fields){
                    if(err) console.error(err);
                })
            }
            if(address != ""){
                var sql1 = "update Professor set address=? where professor_ID=?";
                connection.query(sql1,[address,req.session.user.id],function(err,fields){
                    if(err) console.error(err);
                })
            }
            if(phone_number != ""){

                var sql1 = "update Professor set phone_number=? where professor_ID=?";
                connection.query(sql1,[phone_number,req.session.user.id],function(err, rows) {
                    console.log(phone_number);

                    if(err) console.error(err);
                })
            }
            connection.release();

            res.send("<script>alert('수정 완료');history.back();</script>");

        });    
    } else {
        console.log('로그인된 사용자 없음');
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }

});
module.exports = router;