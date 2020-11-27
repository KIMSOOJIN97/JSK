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

router.get('/', function(req, res, next){   
    if(req.session.user){
        console.log('Friend 접속 ' + req.session.user.id);
        pool.getConnection(function(err, connection){

            var strsql = "select * from friend where My_Student_ID = ?";
            var userid = req.session.user.id;
            connection.query(strsql, [userid], function(err, rows){
                if(err) console.error(err);
            
                console.log("친구목록 "+ rows.length + "명");
                var context = {rows};

                res.render('Friend', context);
                connection.release();
            })
        })
    } else {
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }

});

router.post('/', function(req, res, next){   
        
    pool.getConnection(function (err, connection){
        var searchedID = req.body.friendID;
        var strsql = "select * from student where student_ID = ?";

        connection.query(strsql, [searchedID], function(err, rows){
            if(err) console.error(err);
            console.log("검색한 친구 "+rows);

            if(rows == ""){
                console.log(searchedID + " ID가 존재하지 안습니다")
                res.send("<script>alert('검색된 ID가 존재하지 않습니다.');history.back();</script>");
                connection.release();
            }
            else{
                strsql = "Insert into friend (my_student_id, friend_student_id) values (?,?)";
                var userid = req.session.user.id;
                connection.query(strsql, [userid, searchedID], function(err, rows){
                    if(err) console.error(err);

                    res.send("<script>alert('친구추가 완료!');history.back();</script>");
                    connection.release();

                });
                
            }

        });

    });

});

module.exports = router;