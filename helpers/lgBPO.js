var cheerio = require('cheerio');
var request = require ('request');
var parse = require('csv-parse');
var fs = require('fs');
var dynamo = require('./dynamo.js');

var yr = '2016';
var inputFilePre = './qual_players/';
var inputFileSuf = '_qual_players.csv';
var start_date_pre = '01/01';
var end_date_pre = '12/31/';
var start_date = '01/01/2016';
var end_date = '12/31/2016';
var playerId = {};
var bmSearchPage = 'http://www.baseballmusings.com/cgi-bin/PlayerFind.py?passedname=';
var statsUrl = "http://www.baseballmusings.com/cgi-bin/PlayerInfo.py?StartDate=" + start_date + "&EndDate=" + end_date + "&GameType=all&PlayedFor=0&PlayedVs=0&Park=0&PlayerID=";
var re = RegExp("[=]");
var re2 = RegExp("[>]");

// Inconsistencies between Baseball Reference list of qualified players' names and Baseball Musings database entries
var replaceNames = {
	"Mike Trout": "Michael Trout",
	"Nicholas Castellanos": "Nick Castellanos",
	"Matthew Joyce": "Matt Joyce",
	"Jake Lamb": "Jacob Lamb",
	"Melvin Upton": "B.J. Upton",
	"Zack Cozart": "Zachary Cozart",
	"Jung Ho Kang": "Jung-Ho Kang",
	"Jake Smolinski": "Jacob Smolinski",
	"Danny Santana": "Daniel Santana",
	"Byung Ho Park": "Byung-ho Park",
	"J.B. Shuck": "Jack Shuck",
	"Philip Gosselin": "Phil Gosselin",
	"Nick Franklin": "Nicholas Franklin",
	"Tommy Pham": "Thomas Pham",
	"Mike Moustakas": "Michael Moustakas"
}

// Multiple players in Baseball Musings database with same name or search could not locate player
var nameToId = {
	"Matt Duffy": "13836",
	"Adam Eaton": "11205",
	"Nelson Cruz": "2434",
	"Charlie Blackmon": "7859",
	"Chris Carter": "9911",
	"Cesar Hernandez": "10556",
	"Jose Ramirez": "13510",
	"Ryan Braun": "3410",
	"Jose Bautista": "1887",
	"Hyun Soo Kim": "18718",
	"Carlos Perez": "10642",
	"Jose Reyes": "1736",
	"Travis d'Arnaud": "7739",
	"Chase d'Arnaud": "6652",
	"Ivan De Jesus": "9886",
	"Michael Taylor": "11489",
	"Shawn O'Malley": "9629",
	"Chris Young": "3882",
	"Delino DeShields": "11379",
	"Tommy La Stella": "12371",
	"Josh Bell": "13145",
	"Eric Young": "7158",
	"Ike Davis": "8433",
	"Alex Gonzalez": "520",
	"Carl Crawford": "1201",
	"Alcides Escobar": "6310",
	"Eduardo Nunez": "6848"
}

// Get Name of Player file by year
getPlayerFile = function(year) {
	return (inputFilePre + year + inputFileSuf);
}

// Construct start or end date given year
getFullDate = function(start, year) {
	if (se == "start") {
		return (start_date_pre + year);
	} else {
		return (end_date_pre + year);
	}
}

// Gets player's ID from Baseball Musings' search results page
parseBMId = function(line, name) {
	if (Object.keys(nameToId).indexOf(name) > -1) {
		return nameToId[name];
	}
	
	if (line) {
		start = line.search(re);
		end = line.search(re2);
		sliced_line = line.slice(start + 1, end);
		start2 = sliced_line.search(re);
		id = line.slice(start2 + 9, end - 1);
		return (id);
	} else {
		return (id);
	}
}

// Parses player's game stats page and calculates BPO
parsePage = function(html, id) {
	var result =[];
	if(html) {
		$ = cheerio.load(html);
	
		$('.toprow', '.dbd').each(function (i, row){
			totalRow = $(row).html();
			dataRow = $(row).next().html();
			if($(totalRow).first().text() == "Totals"){
				team = $('.letter', dataRow).text().slice(32,35);
				ab = parseInt($(totalRow).slice(3,4).text());
				hits = parseInt($(totalRow).slice(5,6).text());
				dbl = parseInt($(totalRow).slice(6,7).text());
				tpl = parseInt($(totalRow).slice(7,8).text());
				hr = parseInt($(totalRow).slice(8,9).text());
				bb = parseInt($(totalRow).slice(10,11).text());
				hbp = parseInt($(totalRow).slice(12,13).text());
				sb = parseInt($(totalRow).slice(14,15).text());
				cs = parseInt($(totalRow).slice(15,16).text());
				sh = parseInt($(totalRow).slice(16,17).text());
				sf = parseInt($(totalRow).slice(17,18).text());
				gdp = parseInt($(totalRow).slice(18,19).text());
				tb = hits + dbl + (2 * tpl) + (3* hr);
				b = tb + bb + hbp + sb + sh + sf;
				o = ab - hits + cs + gdp + sh + sf;
				result = [id, b/o, team];
			}
		});
		return result;
	} else {
		return([id, 0.00, "None"]);
	}
}

// External version of parsePage that is used by app.js
exports.pageParser = function(html, id) {
	return (parsePage(html,id));
}

// Function to check if name is contained in replaced names
// Used for when player had a different name (i.e. "Michael" instead of "Mike") in qualified player list vs. Baseball Musings
checkName = function(row, rNames) {
	var name = row[0];
	if (rNames.indexOf(name) > -1) {
		name = replaceNames[name];
	}
	return name;
}

// Sets up a request to Player's stats page on Baseball Musings and returns a promise
getBPO = function(name) {
	return new Promise(function(resolve, reject) {
		var url = bmSearchPage + name.toLowerCase();
		request(url, function(err, res, html) {
			$ = cheerio.load(html);
			line = $('h4').next().html();
			id = parseBMId(line, name);
			var self = id; // preserve pointer to id
			
			request(statsUrl + self, function(err, res, html) {
				result = parsePage(html, self);
				resolve(result);
			});
		});
	});
}

// Main function that reads in qualified player's names, sets up Promises for gathering BPOs, and sets up databases for lgBPO and PlayerId
initBPO = function(year) {
	// Read in file of qualified players
	iFile = getPlayerFile(yr);
	fs.readFile(iFile, function (err, data) {
		// Replace names with Baseball Musings' player names
		var rNames = Object.keys(replaceNames);
		parse(data, {trim: true}, function(err, rows) {
			var names = [];
			
			rows.slice(1).map(function(row) {
				names.push(row[0]);
			});
		
			// Wait for all promises to resolve and calculate LgBPO
			Promise.all(names.slice(0,names.length).map(getBPO)).then(function(data) {
				var sum = 0.0;
				var ct = 0;
				for(var i = 0; i < data.length; i++) {
					bpo = data[i][1];
					playerId[names[i]] = parseInt(data[i][0]);
					// If a BPO is calculated, add to BPO sum and increment counter so that we can compute average BPO
					if(bpo) {
						sum += bpo;
						ct++;
					}
				}
				// Display LgBPO
				console.log("LgBPO: " + sum / ct);
				var lgBpo = {yr: sum / ct};
			
				// check if any names are unidentified
				for(var j = 0; j < names.length; j++){
					if (playerId[names[j]] == 0.00) {
						console.log(names[j]);
					}
				}

				// Initialize DynamoDB table
				dynamo.deletelgBPOTable();
				dynamo.createlgBPOTable();
				dynamo.loadlgBPOTable(lgBpo);
					
				// Test query of lgBPO
				/*dynamo.querylgBPOTable(yr, function(res) {
					console.log(yr + " BPO: " + res[yr]);
				});*/

				// Test to query player's id and calculate BPO
				/*var playerName = "Mookie Betts";
				var identif = playerId[playerName];
			
				request(statsUrl + identif, function(err, res, html) {
					result = parsePage(html, identif);
					console.log(playerName + ": " + result[1]);
				});*/
				
				// Add code for creating and loading PlayerId table and test
				dynamo.deletePlayerIdTable();
				dynamo.createPlayerIdTable();
				dynamo.loadPlayerIdTable(playerId);
					
				// Test query of PlayerId Table
				/*dynamo.queryPlayerIdTable("George Springer", function(res) {
					console.log("ID: " + res["George Springer"]);
				});*/
				
				// Scan keys in PlayerId Table and return all of them
				/*dynamo.scanPlayerIdTable(function(a) {
					console.log("In callback");
					console.log(a);
				});*/
			});
		});
	});
};

//initBPO(yr);