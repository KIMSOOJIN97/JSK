var http = require('http');
var express = require('express');
var router = express.Router();


router.get('/', function(req, res){
<<<<<<< HEAD
    console.log('ZMain 접속');
=======
    console.log('Prof_Main 접속');
>>>>>>> 83a79bc9fc856e1258662c303e777278cfb92f3b

    if(req.session.user) {
        var context = {userid:req.session.user.id};
        res.render('ZMain', context);
    } else {
        
        var context = {userid:'No_One'};
        res.render('ZMain', context);
    }
<<<<<<< HEAD
    
=======
>>>>>>> 83a79bc9fc856e1258662c303e777278cfb92f3b
});

module.exports = router;