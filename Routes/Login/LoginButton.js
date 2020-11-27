<<<<<<< HEAD
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

router.get('/', function (req, res, next) {
    console.log('Login 접속');

    if (req.session.user) {
        console.log('이미 로그인 됨' + req.session.user);
        res.send('이미 로그인 되어 있습니다.');
    } else {
        console.log('로그인된 사용자 없음');
        res.render('Login');
    }
});


// 로그인 DB 확인
router.post('/', function (req, res) {

    var ID = req.body.id;
    var password = req.body.password;
    var stuorprof = req.body.stuorprof || req.query.stuorprof;

    pool.getConnection(function (err, connection) {
        if (stuorprof == 'student')
            var sql = "SELECT * FROM Student WHERE student_ID=?";
        else if (stuorprof == 'professor')
            var sql = "select * from Professor where professor_ID = ?"

        connection.query(sql, [ID], function (err, result) {
            if (err) console.error(err);

            if (result != "") {   // 이메일이 존재하는 경우

                var DB_PW = result[0].password;

                if (DB_PW == password) {   // 입력한 passwd가 일치하는 경우
                    req.session.user = {
                        id: ID,
                        authorized: true
                    };

                    if (stuorprof == 'student')
                        res.redirect('/Main');
                    else if (stuorprof == 'professor')
                        res.redirect('/ZMain');

                }
                else {
                    res.send("<script>alert('패스워드가 일치하지 않습니다.');history.back();</script>");
                    connection.release();
                }
            }
            else {
                res.send("<script>alert('아이디가 존재하지 않습니다.');history.back();</script>");
                connection.release();
            }

        });
    });

});

module.exports = router;
=======
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit: 5,
	host: 'localhost',
	user: 'root',
	database: 'jsk_db',
	password: '1234'

});

router.get('/', function(req, res,next){
    console.log('Login 접속');
        
    if(req.session.user){
        console.log('이미 로그인 됨' + req.session.user);
        res.send('이미 로그인 되어 있습니다.');
    } else {
        console.log('로그인된 사용자 없음');
        res.render('Login');
    }
});

  
  // 로그인 DB 확인
  router.post('/', function(req,res){
    
    var ID = req.body.id;
    var password = req.body.password;
    var stuorprof = req.body.stuorprof || req.query.stuorprof;

    pool.getConnection(function (err, connection)
    {
        if(stuorprof == 'student')
            var sql = "SELECT * FROM Student WHERE student_ID=?";
        else if(stuorprof == 'professor')
            var sql = "select * from Professor where professor_ID = ?"
    
        connection.query(sql, [ID], function(err, result){
          if(err) console.error(err);
          
          if(result != ""){   // 이메일이 존재하는 경우
  
            var DB_PW = result[0].password;

            if(DB_PW == password){   // 입력한 passwd가 일치하는 경우
                    req.session.user = {
                        id:ID,
                        authorized:true
                    };

                if(stuorprof == 'student')
                    res.redirect('/Main');
                else if(stuorprof == 'professor')
                    res.redirect('/ZMain');
            }
            else{
                   res.send("<script>alert('패스워드가 일치하지 않습니다.');history.back();</script>");
                   connection.release();
            }
         }
         else{
            res.send("<script>alert('아이디가 존재하지 않습니다.');history.back();</script>");
            connection.release();
         }
  
        });
    });
    
  });
  
  module.exports = router;
>>>>>>> 83a79bc9fc856e1258662c303e777278cfb92f3b
