var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var https = require('https');
var fs = require('fs');
//var request = require('request');

var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(process.env.PORT || 8001);


app.use('/', express.static(__dirname + '/src'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/beer/:name', function(req, res){
	var resData;
	var url = 'http://api.brewerydb.com/v2/search?q='+req.params.name+'&type=beer&key=4664a9fdf84500cb936e914573258b6f';

	res.type('json');
	http.get(url, function(response){
		response.on('data', function(data){
			if(!resData){
				resData = data;
			}
			else{
				resData += data;
			}
		});
		response.on('end',function(){
			res.send(resData);
		});
	});

	// request(url, function(error, response, body){
	// 	if (!error && response.statusCode == 200) {
	// 		var myObj = JSON.parse(body);
	// 		console.log(body) // Show the HTML for the Google homepage.
	// 		console.log(response.headers['content-type']);
	// 		console.log('TOTAL RESULTS: '+ myObj.totalResults);
	// 		console.log(typeof myObj)
	// 		res.type('json');
	// 		res.send(myObj);
	// 	}
	// });
});