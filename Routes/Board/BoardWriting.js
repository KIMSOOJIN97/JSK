var http = require('http');
var express = require('express');

var router = express.Router();

router.post('/', function(req, res){
    console.log('BoardWriting 접속');
    
    if(req.session.user){
        res.render('BoardWriting');
    } else {
        res.redirect('/Login');
    }
});

module.exports = router;