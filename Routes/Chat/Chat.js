var express = require('express');
var mysql = require('mysql');

var router = express.Router();

var pool = mysql.createPool({
	connectionLimit: 5,
	host: 'localhost',
	user: 'root',
	database: 'jsk_db',
    password: '1234',
});

router.get('/', function(req, res){
   
    if(req.session.user){
        console.log('채팅방목록 입장 ' + req.session.user.id);
        pool.getConnection(function(err, connection){

            var strsql = "select * from chatroom where chatroom_ID IN (select chatroom_ID from chatmember where chatmember_ID = ?);";
            var userid = req.session.user.id;
            connection.query(strsql, [userid], function(err, rows) {
                if(err) console.error(err);

                var context = {rows};
                res.render('Chat', context);
                connection.release();

            });
        });

    } else {
        res.send("<script>alert('로그인 되어있지 않습니다.');history.back();</script>");
    }

});

router.post('/', function(req, res){

    if(req.session.user == undefined){
        res.redirect('/Login');
        return;
    }

    var aa = JSON.parse(JSON.stringify(req.body)); 
    var checkedmem = Object.keys(aa).length;
    
    if(checkedmem < 1) {
        console.log('초대할 사람을 선택하지 않았습니다.');
        res.send("<script>alert('초대할 사람을 선택하세요.');history.back();</script>");
        return;
    }

    var chatusers = [];
    var chatname = "";
    chatusers.push(req.session.user.id);
    chatname += req.session.user.id + ", ";
    for (var key in aa) {
        chatusers.push(key);  
        chatname += key + ", ";
    }
    console.log("체크된 사용자: " + chatusers);
    console.log("체크된 사용자 수: " + chatusers.length);
    console.log(chatname);

    pool.getConnection(function(err, connection){

        var strsql = "insert into chatroom (chatroomsize, chatroomname) values (?,?);"
        connection.query(strsql, [chatusers.length, chatname], function(err, rows) {
            if(err) console.error(err);
            console.log('chatroom 생성완료 ' + chatname);
        });

        strsql = "select chatroom_ID from chatroom where chatroomname = ?";
        connection.query(strsql, [chatname], function(err, rows){
            if(err) console.error(err);

            var chatroom_ID = rows[0].chatroom_ID;
            console.log('chatroom_ID: ' + chatroom_ID);

            for(var i =0; i<chatusers.length; i++){

                strsql = "insert into chatmember (chatroom_ID, chatmember_ID) values (?,?)";

                connection.query(strsql, [chatroom_ID, chatusers[i]], function(err, rows){
                    if(err) console.error(err);
                })
            }
        });

        res.redirect('/Chat');
        connection.release();


    })

});

module.exports = router;