var http = require('http');
var express = require('express');
var mysql = require('mysql');
var fs = require('fs');

var router = express.Router();

router.get('/', function(req, res){
    console.log('Upload 접속');

    if(req.session.user) {
        
        res.render('Upload');        
    
    } else {
    
        var context = {userid:'No_One'};
        res.render('Login', context);
    
    }
    
});

module.exports = router;