var express = require('express');
var AWS = require('aws-sdk');

// Initialize Express
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + ''));

// Set up view engine to output HTML
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// Base route for loading home page
app.get('/', function(req, res) {
	res.render('home_redux.html');
});

// Generic 404 page
app.use(function(req, res, next){
	res.status(404);
	res.render('404.html');
});

app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' + 
    app.get('port') + '; press Ctrl-C to terminate.' );
});