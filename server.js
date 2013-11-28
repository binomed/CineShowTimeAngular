var static = require('node-static');
var http = require('http');
var file = new(static.Server)();

// cet objet là c'est pour que ca marche en local sur mon poste.
// C'est à adapter pour ta plateforme. Par exemple : 
// var options = { hostname: 'computeengineondemand.appspot.com', port: 80, path: '/turn?username=41784574&key=4080218913&_=1384336940360', method: 'GET' };
var options = {
  host: "localhost",
  port: 3128,
  method: 'GET',
  path: "http://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913&_=1384336940360",
  headers: {
    Host: "computeengineondemand.appspot.com"
  }
};
options = { hostname: 'computeengineondemand.appspot.com', port: 80, path: '/turn?username=41784574&key=4080218913&_=1384336940360', method: 'GET' };


var app = http.createServer(function (request, response) {
	if (request.method === 'GET' && request.url === '/turn.json') {

      // c'est cette partie là qui t'intéresse :

      var req = http.request(options, function(res) {
        //res.setEncoding('utf8');
        var data = '';
        res.on('data', function(chunk) {
          data += chunk;
        });
        res.on('end', function(chunk) {
          response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(data);
        });

      });

      req.on('error', function(e) {
        response.writeHead(500, {'Content-Type': 'text/plain'});
        response.end('ERROR: ' + e.message);
      });

      req.end();

      // fin de la partie qui t'intéresse




  	} else {
		file.serve(request, response);
	}
}).listen(80);


var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 9999});
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: %s', message);
        wss.broadcast(message);
    });
    //ws.send('something');
});


wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
};


// var express = require('express');
// var app = express();
// console.log(express.static(__dirname + '/js'));
// app.use(express.static(__dirname + '/js'));
// app.all('*', function(req, res){
// 	res.sendfile("index.html");
// });

// app.listen(9000);


///// Sam Dutton Method

var io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket){

	function log(){
		var array = [">>> "];
	  for (var i = 0; i < arguments.length; i++) {
	  	array.push(arguments[i]);
	  }
	    socket.emit('log', array);
	}

	socket.on('message', function (message) {
		log('Got message: ', message);
		socket.broadcast.emit('message', message); // should be room only
	});

	socket.on('create or join', function (room) {
		var numClients = io.sockets.clients(room).length;

		log('Room ' + room + ' has ' + numClients + ' client(s)');
		log('Request to create or join room', room);

		if (numClients == 0){
			socket.join(room);
			socket.emit('created', room);
		} else if (numClients <= 2) {
			io.sockets.in(room).emit('join', room);
			socket.join(room);
			socket.emit('joined', room);
		} else { // max two clients
			socket.emit('full', room);
		}
		socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
		socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

	});

});



/// WebRTC io
/*var webRTC = require('webrtc.io').listen(app);*/