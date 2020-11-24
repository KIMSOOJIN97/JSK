var http = require('http');
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

router.post('/', function(req, res){
    console.log('채팅방 생성 버튼 누름.');
    if(req.session.user == undefined){
        res.redirect('/Login_MariaDB');
        return;
    }
        
    var aa = JSON.parse(JSON.stringify(req.body)); 
    console.log("체크된 사용자: " + aa);
    console.log("체크된 사용자 수: " + Object.keys(aa).length);
    var checkedmem = Object.keys(aa).length;
    
    if(checkedmem < 1) {
        console.log('초대할 사람을 선택하지 않았습니다.');
        res.redirect('/Chat');
        return;
    }
    
    var chatusers = [];
    chatusers.push(req.session.user.id);
    for (var key in aa) {
        chatusers.push(key);  
    }
    console.log(chatusers);
    console.log(chatusers.length);
    
    var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rkdvnd52',
    database: 'face_recognition'
    });
    connection.connect();
    
    
    var strsql = "select * from chatroom where room_memnum = " + chatusers.length;
    connection.query(strsql, function(err, rows, fields) {
        if (err) throw err;
        
        if(rows.length > 0) {
            for(var i = 0; i < rows.length; i++) {
                var cur = rows[i].room_mem;
                var curusers = new Array();
                curusers = cur.split(',');
                
                curusers = curusers.filter(function(val) {
                    return chatusers.indexOf(val) == -1;
                });
                
                if(curusers.length<1) {
                    console.log('이미 생성된 방이 있습니다.');
                    res.redirect('/Chat');
                    connection.end();   
                    return;
                }
            }
        }
        
        strsql = "insert into chatroom (room_name, room_mem, room_memnum) values ('" + chatusers + "', '" + chatusers + "', '" + chatusers.length + "')";
        
        connection.query(strsql, function(err, rows, fields) {
            if(err) {
                res.send('채팅방 생성 실패.');
                return;
            }
            
            if(rows.affectedRows>0){
                console.log('채팅방 생성됨.');
                
                res.redirect('/Chat');
            } else {
                console.log('생성된 채팅방이 없음.');
                res.send('생성된 채팅방이 없음.');
            }
        });
        connection.end();      
    });
    
});

module.exports = router;