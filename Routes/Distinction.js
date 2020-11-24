var http = require('http');
var express = require('express');

var router = express.Router();

router.get('/', function(req, res){
    console.log('Distinction 접속');
    
    res.render('Distinction');

});

module.exports = router;