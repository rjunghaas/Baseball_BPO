var cheerio = require('cheerio');
var request = require('request');
var dynamo = require('./dynamo.js');

// Prefix for link to scrape ballpark factors from
var park_prefix = 'http://www.espn.com/mlb/stats/parkfactor?year=';
var yr = '2016';

// Map ballpark names to team abbreviations
var park_abbr = {
	'Coors Field': 'COL',
	'Chase Field': 'ARI',
	'Progressive Field': 'CLE',
	'Fenway Park': 'BOS',
	'Kauffman Stadium': 'KCA',
	'Rogers Centre': 'TOR',
	'Globe Life Park in Arlington': 'TEX',
	'Turner Field': 'ATL',
	'Target Field': 'MIN',
	'Yankee Stadium': 'NYA',
	'Comerica Park': 'DET',
	'Petco Park': 'SDN',
	'AT&T Park': 'SFN',
	'PNC Park': 'PIT',
	'Great American Ball Park': 'CIN',
	'Citi Field': 'NYN',
	'Miller Park': 'MIL',
	'Nationals Park': 'WSH',
	'Oriole Park at Camden Yards': 'BAL',
	'Safeco Field': 'SEA',
	'Guaranteed Rate Field': 'CHA',
	'Busch Stadium': 'SLN',
	'Angel Stadium of Anaheim': 'LAA',
	'Tropicana Field': 'TBA',
	'Wrigley Field': 'CHN',
	'Citizens Bank Park': 'PHI',
	'Marlins Park': 'MIA',
	'Oakland Coliseum': 'OAK',
	'Dodger Stadium': 'LAN',
	'Minute Maid Park': 'HOU',
	'Hard Rock Stadium': 'MIA',
	'Mall of America Field': 'MIN',
	'RFK Stadium': 'WSH',
	'Shea Stadium': 'NYN',
	'Veterans Stadium': 'PHI',
	'Qualcomm Stadium': 'SDN',
	'Olympic Stadium': 'WSH',
	'Cinergy Field': 'CIN'
};

// Take HTML and scrape to make hash of all ballparks and their park factors into an object
makeParkHash = function(park_list) {
	var park_hash = {};
	var re = RegExp("[^0-9]");
	var re1 = RegExp("[(]");
	var re2 = RegExp("[)]");
	
	for (i = 0; i < park_list.length; i++) {
		row = park_list[i];
		park_start = row.search(re);
		park_end = row.search(re1);
		park = row.slice(park_start, park_end);
		park_short = park_abbr[park.trim()]
	
		pf_start = row.search(re2) + 1;
		pf_end = pf_start + 5;
		pf = row.slice(pf_start, pf_end);
		park_hash[park_short] = pf;
	}
	return park_hash
}

// Initialize databases, send request to get HTML data, and then store park hash in database
initParkDB = function(year) {
	dynamo.deleteBallparksTable(year);
	request(park_prefix+year, function(err, res, html){
		var result = [];
	
		$ = cheerio.load(html);
		$('.oddrow', '.tablehead').each(function(i, row) {
			result.push($(row).text());
		});
	
		$('.evenrow', '.tablehead').each(function(i, row) {
			result.push($(row).text());
		});
	
		park_hash = makeParkHash(result);
		console.log(park_hash);
		
		dynamo.createBallparksTable(year);
		dynamo.loadBallParksTable(year, park_hash);
	});
}

//initParkDB(yr);