var express = require('express');
var bodyParser = require('body-parser');
var request = require ('request');
var park_scraper = require('./helpers/park_scraper.js');
var lgBPO = require('./helpers/lgBPO.js');
var dynamo = require('./helpers/dynamo.js');

// Initialize Express
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + ''));

// Required lines for body-parser to get JSON in POST body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up view engine to output HTML
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

var start_date = '01/01/';
var end_date = '12/31/';
var statsUrl1 = "http://www.baseballmusings.com/cgi-bin/PlayerInfo.py?StartDate=";
var statsUrl2 = "&EndDate=";
var statsUrl3 = "&GameType=all&PlayedFor=0&PlayedVs=0&Park=0&PlayerID=";

// If this is our first time running app, should set an environment variable "INIT=True" to set up databases
if(process.env.INIT) {
	console.log("Initializing");
	park_scraper.initParkDB('2016');
	lgBPO.initBPO();
}

// Base route for loading home page
app.get('/', function(req, res) {
	res.render('home.html');
});

// API call for returning a list of all players in the PlayerId database
app.get('/players', function(req, res) {
	dynamo.scanPlayerIdTable(function(res_arr) {
		res.writeHead(200, {"Content-Type": "application/json"});
   		var output = { error: null, data: res_arr };
   		res.end(JSON.stringify(output) + "\n");
	});
});

// API call for computing player's BPO, BPO+, and lgBPO for given year
app.post('/submit', function(req, res) {
	// Gather player's name and year from POST body
	var name = req.body.name;
	var year = req.body.year;
	
	// construc start date
	var sd = start_date + year;
	var ed = end_date + year;
	
	var self = res
	
	// Construct statsUrl
	var statsUrl = statsUrl1 + sd + statsUrl2 + ed + statsUrl3;
	
	// Get Player's ID from PlayerID database table
	dynamo.queryPlayerIdTable(name, function(res) {
		var id = res[name];
		
		// Create a request to Baseball Musings' player stats page and parse stats to compute BPO
		request(statsUrl + id, function(err, res, html) {
			bpo = lgBPO.pageParser(html, id);
			
			// Query lgBPO table and get year's lgBPO which was calculated during initialization
			dynamo.querylgBPOTable(year, function(res) {
					var lgBPO = res[year];
					
					// Query ballparks database table and get park factor for player's home ballpark
					dynamo.queryBallparksTable(year, bpo[2], function(result) {
						var bpf = result[bpo[2]];
						
						// compute BPO+
						var bpoPlus = (bpo[1] / lgBPO) * 100 / bpf;
						
						// Put results into JSON and return to front-end
						self.writeHead(200, {"Content-Type": "application/json"});
						var output = {error: null, bpo: bpo[1], lgBPO: lgBPO, bpoPlus: bpoPlus};
						self.end(JSON.stringify(output) + "\n");
					});
			});
		});
	});
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