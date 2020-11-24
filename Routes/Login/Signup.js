var http = require('http');
var express = require('express');

var router = express.Router();

router.get('/', function(req, res){
    console.log('Sign up 접속');
    
    res.render('Signup');
});

module.exports = router;