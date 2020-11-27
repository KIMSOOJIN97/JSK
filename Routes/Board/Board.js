var express = require('express');
var router = express.Router();

var mysql = require('mysql');
const { connect } = require('../Login/Logout');
var pool = mysql.createPool({
	connectionLimit: 5,
	host: 'localhost',
	user: 'root',
	database: 'jsk_db',
	password: '1234'
});

router.get('/', function(req, res){
    console.log('Board 접속');
    pool.getConnection(function(err,connection){

        var context = {userid:req.session.user.id};
        
            var sql ="select * from Notice"
            
            connection.query(sql,function(err,results,field){
                if (err) throw err;
                console.log(results);
                res.render('Board', {results :results,userid:req.session.user.id});
                connection.end();
            })
        
    })
});
module.exports = router;