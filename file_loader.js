var fs = require('fs');

var file_loader = {};

file_loader.init = function(app){
    
    app.get('/', function(req, res) {
        console.log('LKP page 접속');

        if(req.session.user){
            var context = {userid:req.session.user.id}
            res.render('Login', context);
        }
        
        var context = {userid:'No_One'};
        res.render('Login', context);
    });
    
    var testpath = './Routes';
    readfile(testpath, app);
    
    console.log('file_loader 실행 완료');
};

function readfile (testpath, app) {
    var dirs=[];
    
    fs.readdirSync(testpath, {withFileTypes: true}).forEach(p=> {
        if(p.isFile()) {
            var path = testpath + '/' + p.name;      
            var name = p.name.lastIndexOf(".");
            var virtualpath = '/' + p.name.substring(0, name);
            var curModule = require(path);
            
            app.use(virtualpath, curModule);
            
        } else if(p.isDirectory()) {
            dirs.push(testpath + '/' + p.name);
        }
    })
    
    if(dirs) {
        dirs.forEach(p=> {
            testpath = p;
            readfile(testpath, app);
        })
    } else {
        return;
    }
}

module.exports = file_loader;