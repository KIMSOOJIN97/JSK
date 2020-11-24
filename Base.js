/////////////////////////////////////require/////////////////////////////////////
////poong
var http = require('http');
var express = require('express');
var sql = require('mssql');
var static = require('serve-static');
var path = require('path');
var bodyparser = require('body-parser');

var errorHandler = require('errorhandler');
var expressErrorHandler = require('express-error-handler');

var expressSession = require('express-session');

var socketio = require('socket.io');
var cors = require('cors');

var config = require('./config');

var file_loader = require('./file_loader');

//////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////body/////////////////////////////////////

var app = express();
var router = express.Router();

app.set('port', config.server_port || 3000);
app.use(static(path.join(__dirname, 'Pages')));
app.use(static(path.join(__dirname, 'Sources')));
app.use(static(path.join(__dirname, 'Uploads')));


app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use(expressSession({
    secret:'my key',
    resave: true,
    saveUninitialized:true
}));

app.set('views', __dirname + '/Pages');
app.set('view engine', 'ejs');
console.log('view 엔진이 ejs로 설정되었습니다.');

app.use(cors());

file_loader.init(app);

//////////////////////////////////////////////////////////////////////////////
//////////////////////error, server, database connection//////////////////////

var errorHandler = expressErrorHandler({
    static: {
        '404': config.errorpage
    }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Server 실행함. : ' + app.get('port'));
});

//////////////////////////////////////////////////////////////////////////////
////////////////////////////////////socket////////////////////////////////////

var io = socketio.listen(server);
console.log('socket.io 요청을 받아들일 준비가 되었습니다.');

io.sockets.on('connection', function(socket) {
	console.log('웹소켓 서버에 연결되었습니다. connection info :'+ socket.request.connection._peername);    

    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;

    
    socket.on('message', function(message) {
        console.log('message 이벤트를 받았습니다.');
    	
        io.sockets.in(message.recepient).emit('message', message);
    });
    
    socket.on('room', function(room) {
    	console.log('room 이벤트를 받았습니다.');

        if (room.command === 'create') {

        	if (io.sockets.adapter.rooms[room.roomId]) {
        		socket.join(room.roomId);
                console.log('방에 입장했습니다.');
        		
        	} else {
        		console.log('방을 새로 만듭니다.');
        		
        		socket.join(room.roomId);
        		
	            var curRoom = io.sockets.adapter.rooms[room.roomId];
	            curRoom.id = room.roomId;
	            curRoom.name = room.roomName;
	            curRoom.owner = room.roomOwner;
        	}
        } 
    });
       
});





















