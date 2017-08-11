var AWS = require('aws-sdk');

// AWS Local Endpoint Config Object
/*AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});*/

// AWS Web Service Endpoint Config Object
AWS.config.update({
	region: "us-west-2",
	endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

// Initialize DynamoDB Objects
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

// Generalized functions for database operations

createTable = function(schema) {
	dynamodb.createTable(schema, function(err, data) {
    	if (err) {
    	    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    	} else {
    	    console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    	}
	});
}

putData = function(params) {
	docClient.put(params, function(err, data) {
		if(err) {
			console.error("Unable to add data. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			console.log("PutItem succeeded.");
		}
	});
}

deleteTable = function(params) {
	dynamodb.deleteTable(params, function(err, data) {
   		if (err) {
   	 		console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
   	 	} else {
   	 		console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
   		}
	});
}

// Functions for ballparks table to store park factors by year

exports.createBallparksTable = function(year) {
	var name = "Ballparks_" + year;
	
	var schema = {
		TableName: name,
		KeySchema: [
			{ AttributeName: "abbr", KeyType: "HASH" },
			{ AttributeName: "park_factor", KeyType: "RANGE" }
		],
		AttributeDefinitions: [
			{ AttributeName: "abbr", AttributeType: "S" },
			{ AttributeName: "park_factor", AttributeType: "N" }
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 10,
			WriteCapacityUnits: 10
		}
	};

	createTable(schema);
	console.log("Ballparks Table created");
}

exports.loadBallParksTable = function(year, data) {
	var tableName = "Ballparks_" + year;
	
	keys = Object.keys(data);
	keys.forEach(function(key) {
		var params = {
			TableName: tableName,
			Item: {
				'abbr': key,
				'park_factor': parseFloat(park_hash[key])
			}
		};
	
		putData(params);
	});
	console.log("Data loaded to Ballparks Table");
}

exports.queryBallparksTable = function(year, string, callback) {
	var tableName = "Ballparks_" + year;
	var params = {
		TableName: tableName,
		KeyConditionExpression: "#abbr = :xxx",
		ExpressionAttributeNames: {
			"#abbr": "abbr"
		},
		ExpressionAttributeValues: {
			":xxx": string
		}
	};
	
	docClient.query(params, function(err, data) {
		var res = {};
		if (err) {
    	    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    	} else {
        	console.log("Query succeeded.");
        	data.Items.forEach(function(item) {
           		res[item.abbr] = item.park_factor;
        	});
        	return callback(res);
		}
	});
}

exports.deleteBallparksTable = function(year) {
	var tableName = "Ballparks_" + year;
	var params = {
		TableName: tableName
	};
	
	deleteTable(params);
	console.log("Ballparks Table deleted");
}

// Functions for lgBPO table which will have a key for each year and value for average BPO that year

exports.createlgBPOTable = function() {
	var schema = {
		TableName: "lgBPO_Table",
		KeySchema: [
			{ AttributeName: "year", KeyType: "HASH" },
			{ AttributeName: "lgBPO", KeyType: "RANGE" }
		],
		AttributeDefinitions: [
			{ AttributeName: "year", AttributeType: "S" },
			{ AttributeName: "lgBPO", AttributeType: "N" }
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 10,
			WriteCapacityUnits: 10
		}
	};
	
	createTable(schema);
	console.log("lgBPO Table created");
}

exports.loadlgBPOTable = function(data) {
	keys = Object.keys(data);
	keys.forEach(function(key) {
		var params = {
			TableName: "lgBPO_Table",
			Item: {
				'year': key,
				'lgBPO': parseFloat(data[key])
			}
		};
		putData(params);
	});
	console.log("Data loaded to lgBPO Table");
}

exports.querylgBPOTable = function(yr, callback) {
	var params = {
		TableName: "lgBPO_Table",
		KeyConditionExpression: "#year = :yyyy",
		ExpressionAttributeNames: {
			"#year": "year"
		},
		ExpressionAttributeValues: {
			":yyyy": yr
		}
	};
	
	docClient.query(params, function(err, data) {
		var res = {};
		if (err) {
    	    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    	} else {
        	console.log("Query succeeded.");
        	data.Items.forEach(function(item) {
           		res[item.year] = item.lgBPO;
        	});
        	return callback(res);
		}
	});
}

exports.deletelgBPOTable = function() {
	var tableName = "lgBPO_Table";
	var params = {
		TableName: tableName
	};
	
	deleteTable(params);
	console.log("lgBPO Table deleted");
}

// Functions for a master table of player names and ids

exports.createPlayerIdTable = function() {
	var schema = {
		TableName: "PlayerId_Table",
		KeySchema: [
			{ AttributeName: "nm", KeyType: "HASH" },
			{ AttributeName: "id", KeyType: "RANGE" }
		],
		AttributeDefinitions: [
			{ AttributeName: "nm", AttributeType: "S" },
			{ AttributeName: "id", AttributeType: "N" }
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 10,
			WriteCapacityUnits: 10
		}
	};
	
	createTable(schema);
	console.log("PlayerId Table created");
}

exports.queryPlayerIdTable = function(name, callback) {
	var params = {
		TableName: "PlayerId_Table",
		KeyConditionExpression: "#name = :nnnn",
		ExpressionAttributeNames: {
			"#name": "nm"
		},
		ExpressionAttributeValues: {
			":nnnn": name
		}
	};
	
	docClient.query(params, function(err, data) {
		var res = {};
		if (err) {
			console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    	} else {
        	console.log("Query succeeded.");
        	data.Items.forEach(function(item) {
           		res[item.nm] = item.id;
        	});
        	return callback(res);
		}
	});
}

exports.loadPlayerIdTable = function(data) {
	console.log("Loading Player data");
	keys = Object.keys(data);
	keys.forEach(function(key) {
		var params = {
			TableName: "PlayerId_Table",
			Item: {
				'nm': key,
				'id': parseInt(data[key])
			}
		};
		putData(params);
	});
	console.log("Data loaded to PlayerID Table");
}

exports.deletePlayerIdTable = function() {
	var tableName = "PlayerId_Table";
	var params = {
		TableName: tableName
	};
	
	deleteTable(params);
	console.log("PlayerId Table deleted");
}

// Function for scanning PlayerId table and returning array of all keys (player names)
exports.scanPlayerIdTable = function(callback) {
	var params  = {
		TableName: "PlayerId_Table",
        ProjectionExpression: "#name",
        ExpressionAttributeNames: {
        	"#name": "nm",
        }
    };
    
    docClient.scan(params, function(err, res) {
    	if(err) {
    		console.error("Unable to scan the table.  Error JSON: ", JSON.stringify(err, null, 2));
        } else {
            var arr = [];
            for (var k = 0; k < res["Items"].length; k++) {
            	arr.push(res["Items"][k].nm);
            }
            return(callback(arr));
        }
    });
}
