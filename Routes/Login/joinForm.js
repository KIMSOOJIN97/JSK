var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit: 5,
	host: 'localhost',
	user: 'root',
	database: 'jsk_db',
    password: '1234',
});

function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();
  
    if (n.length < digits) {
      for (i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
  }
  
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('joinForm', { title: 'joinForm'/*, username:req.session.username, admin:req.session.admin, sale:req.session.sale*/ });
  });

  router.post('/', function(req,res,next){

    var stuorprof = req.body.stuorprof || req.query.stuorprof;
    var ID = req.body.ID;
    var email = req.body.email;
    var password = req.body.passwd;
    var name = req.body.username;
    var address = req.body.address;
    var address2 = req.body.address2;
    var phone_number = req.body.phone;

    var datas = [ID, name];
    
    if(address2 != "") address = address+" "+address2;
    console.log(stuorprof);
    pool.getConnection(function (err, connection)
    {
        if(stuorprof == 'student')
            var strsql = "select * from student where student_ID = ? AND student_name = ?"
        else if(stuorprof == 'professor')
            var strsql = "select * from professor where professor_ID = ? AND professor_name = ?"
    
        connection.query(strsql, datas, function(err, result){
        
            if(err) console.error(err);
                
            if(result != ""){	// 이메일이 이미 존재하는  경우
                res.send("<script>alert('이메일이 이미 존재합니다.');history.back();</script>");
                connection.release();
            }
            else{
                pool.getConnection(function (err, connection){
                   
                    if(stuorprof == 'student')
                        var sql = "INSERT INTO student(student_ID, password, student_name,phone_number, email,address) values(?,?,?,?,?,?)";
                    else if(stuorprof == 'professor')
                        var sql = "INSERT INTO professor(professor_ID, password, professor_name,phone_number, email,address) values(?,?,?,?,?,?)";
                   
                        connection.query(sql, [ID, password, name, phone_number, email,address], function(err, result){
                        if(err) console.error(err);
                        res.send("<script>alert('회원가입 되었습니다.');window.location.href='/'</script>");
                    });
                });
            }
        });
    });
  });
  
  module.exports = router;