var http = require('http');
var express = require('express');

var router = express.Router();

router.get('/', function(req, res){
    console.log('Logout 접속');
    
    if(req.session.user){
        
        console.log('Logout 실행함.');
        
        req.session.destroy(function(err) {
            if(err) {
                console.log('세션 삭제 시 에러 발생.');
                res.render('404');
            };
        });
        
        res.redirect('/Main');
        
    } else {
        console.log('이미 로그아웃 되어 있음');
        
        res.send('이미 로그아웃 되어 있습니다.');
        
    }
});

module.exports = router;