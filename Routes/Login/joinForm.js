var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit: 5,
	host: 'localhost',
	user: 'root',
	database: 'tutorial',
	password: '1234'
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
      var student_ID = req.body.ID;
      var email = req.body.email;
      var passwd = req.body.passwd;
      var student_name = req.body.username;
      var address = req.body.address;
      var address2 = req.body.address2;
      var phone_number = req.body.phone;

      console.log(req.address);

      if(address2 != "") address = address+" "+address2;

      pool.getConnection(function (err, connection)
      {
          var sql = "SELECT * FROM Student WHERE email=?";
          connection.query(sql, [email], function(err, result){
              if(err) console.error(err);
              
              if(result != ""){	// 이메일이 이미 존재하는  경우
                  res.send("<script>alert('이메일이 이미 존재합니다.');history.back();</script>");
                  connection.release();
              }
              else{
                  pool.getConnection(function (err, connection)
                  {
                      var sql = "INSERT INTO Student(student_ID, passwd, student_name,phone_number, email,address) values(?,?,?,?,?,?)";
                      connection.query(sql, [student_ID, passwd, student_name, phone_number, email,address], function(err, result){
                          if(err) console.error(err);
                          
                          res.send("<script>alert('회원가입 되었습니다.');window.location.href='/'</script>");
                      });
                  
                  });
              }
          });
          
      });
  });
  
  module.exports = router;