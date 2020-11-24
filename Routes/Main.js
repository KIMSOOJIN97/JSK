var http = require('http');
var express = require('express');

var router = express.Router();

router.get('/', function(req, res){
    console.log('Main 접속');

    if(req.session.user) {
        var context = {userid:req.session.user.id};
        res.render('Main', context);
    } else {
        
        var context = {userid:'No_One'};
        res.render('Main', context);
    }
    
});

module.exports = router;