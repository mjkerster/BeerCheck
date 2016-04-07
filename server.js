var express = require('express');
var path = require('path');
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
var dbConstantObj = {
	apiKey : '62Hbco6a2MTpXS68g9F-Jh8uAVR2XF-M',
	apiRoot : 'https://api.mongolab.com/api/1/databases/kerster_db/'
};

// var options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };

// https.createServer(options, app).listen(process.env.PORT || 8001);
http.createServer(app).listen(process.env.PORT || 8001);

app.use('/', express.static(__dirname + '/src'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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
});

app.get('/mybeer', function(req, res){
	var resData;
	var url = 'https://api.mongolab.com/api/1/databases/kerster_db/collections/beers?apiKey=62Hbco6a2MTpXS68g9F-Jh8uAVR2XF-M';
	
	res.type('json');
	https.get(url, function(response){
		console.log('GET MyBeer STATUS'+ response.statusCode)
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
});

app.post('/beer/add', function(req, res){
	var resData;
	var post_data = JSON.stringify(req.body);
	var postOptions = {
		host: 'api.mongolab.com',
		path: '/api/1/databases/kerster_db/collections/beers?apiKey=62Hbco6a2MTpXS68g9F-Jh8uAVR2XF-M',
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		}
	}

	var request = https.request(postOptions, function(response){
		response.on('data', function(data){
			console.log('POST Beer STATUS: '+ response.statusCode);
			if(!resData){
				resData = data;
			}
			else{
				resData += data;
			}
		});
		response.on('end', function(){
		    res.send(resData);
		});
	});
	request.on('error', function(e){
		console.log('problem with request: ' +e.message);
	});
	request.write(post_data);
	request.end();
});