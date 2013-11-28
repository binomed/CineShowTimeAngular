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
  path: "http://10.binomed-andshowtime-project-1.appspot.com/showtime/near?place=nantes&day=0&lang=fr&curenttime="+(new Date().getTime())+"&timezone=GMT+1&oe=UTF-8&ie=UTF-8&countryCode=FR&output=json",
  headers: {
    Host: "computeengineondemand.appspot.com"
  }
};

"http://10.binomed-andshowtime-project-1.appspot.com/"
        +"/showtime/near?place=nantes&day=0&lang=fr"
        +"&curenttime="+(new Date().getTime())
        +"&timezone=GMT+1"
        +"&oe=UTF-8&ie=UTF-8&countryCode=FR&output=json";

options = { 
  hostname: '10.binomed-andshowtime-project-1.appspot.com', 
  port: 80, 
  path: "/showtime/near?place=nantes&day=0&lang=fr&curenttime="+(new Date().getTime())+"&timezone=GMT+1&oe=UTF-8&ie=UTF-8&countryCode=FR&output=json", 
  method: 'GET' 
};


var app = http.createServer(function (request, response) {
  console.log(request.url);
	if (request.method === 'GET' && request.url && request.url.indexOf('/search.json') != -1) {

      // c'est cette partie là qui t'intéresse :
      options.path = "/showtime/near?"+request.url.substr(13, request.url.length);
      console.log("Will Call : "+options.hostname+options.path);
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
  	} else {
		file.serve(request, response);
	}
}).listen(80);

