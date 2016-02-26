// get http and filesystem modules
var http = require('http'),
	fs = require('fs');

// create our server using the http module
http.createServer(function(req, res){

	//  write to our server, set configuration for the response
	res.writeHead(200, {
		'Content-Type': 'text/html', 
		'Access-Control-Allow_Origin'  : '*'
	});

	// grab the index.html file using FS
	var readStream = fs.createReadStream(__dirname + '/index.html');

	// send the index.html to our user
	readStream.pipe(res);

}).listen(1337);

console.log('Visit me at http://localhost:1337');