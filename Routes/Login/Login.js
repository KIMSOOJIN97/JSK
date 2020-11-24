var http = require('http');
var express = require('express');

var router = express.Router();

router.get('/', function(req, res){
    console.log('Login 접속');
        
    if(req.session.user){
        console.log('이미 로그인 됨' + req.session.user);
        res.send('이미 로그인 되어 있습니다.');
    } else {
        console.log('로그인된 사용자 없음');
        res.render('Login');
    }
});

module.exports = router;