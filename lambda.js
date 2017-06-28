var park_scraper = require('./helpers/park_scraper.js');
var lgBPO = require('./helpers/lgBPO.js');
var dynamo = require('./helpers/dynamo.js');
var AWS = require('aws-sdk');
var request = require ('request');

var start_date = '01/01/';
var end_date = '12/31/';
var statsUrl1 = "http://www.baseballmusings.com/cgi-bin/PlayerInfo.py?StartDate=";
var statsUrl2 = "&EndDate=";
var statsUrl3 = "&GameType=all&PlayedFor=0&PlayedVs=0&Park=0&PlayerID=";

// API call for returning a list of all players in the PlayerId database
exports.playerListHandler = function(event, context, callback) {
	console.log(event.httpMethod);
	switch (event.httpMethod) {
		case 'GET':
			dynamo.scanPlayerIdTable(function(res_arr) {
				var output = { data: res_arr };
				return(callback(null, output));
			});
			break;
			
		default:
			return(callback(null, []));
	}
}

// API call for computing player's BPO, BPO+, and lgBPO for given year
exports.submitHandler = function(event, context, callback) {
	// Gather player's name and year from POST body
	var name = event.body.name;
	var year = event.body.year;
	
	// construc start date
	var sd = start_date + year;
	var ed = end_date + year;
	
	// Construct statsUrl
	var statsUrl = statsUrl1 + sd + statsUrl2 + ed + statsUrl3;
	
	switch(event.httpMethod) {
		case 'POST':
			// Get Player's ID from PlayerID database table
			console.log("POST detected");
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
							var output = { bpo: bpo[1], lgBPO: lgBPO, bpoPlus: bpoPlus };
							return(callback(null, output));
						});
					});
				});
			});
			break;
		
		default:
			return(callback(null, []));
	}
}