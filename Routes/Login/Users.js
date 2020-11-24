var http = require('http');
var express = require('express');
var sql = require('mssql');

var router = express.Router();

router.get('/', function(req, res){
    console.log('Users 접속');
    
    var request = new sql.Request();
    
    if(req.session.user) {
        var logineduser = "'" + req.session.user.id + "'";
        var strsql = "select * from dbo.users where not b_id = " + logineduser;
    } else {
        var strsql = "select * from dbo.users";
    }
    
    request.query(strsql, function(err, result){
        if(err) res.render('404');
            
        res.render('Users', result);

    });
    
});

module.exports = router;