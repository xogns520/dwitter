//mongo DB
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;

function increasePay(id, vote){
//vote can replace myValue and totalValue, need to check
	console.log("increasePay",id);
	  MongoClient.connect(url, function(err, db) {
   		 var dbo = db.db("heroku_dg3d93pq");
    		var findquery = {account : id};		  
    		dbo.collection("user").findOne(findquery, function(err, result){
     			 if(result == null){
      			//if result is null, then return -1
      			//do nothing
	     		 console.log("nothing to increase pay");
      		}else{

			var newValue = 0;
			newValue += (parseInt(result.wallet, 10) + vote);
	      		var newvalues = { $set: {wallet : newValue } };
	      		dbo.collection("user").updateOne(findquery, newvalues, function(err, result){
		      		if (err) throw err;
	      		        db.close();
      			});
      		}
    
        	});
        });
}

var totalScore = 0;

function getTotalScore(){
	var vote;
	var sum = 0;
	MongoClient.connect(url, function(err, db) {
		var dbo = db.db("heroku_dg3d93pq");
		
		dbo.collection("user").find({}).toArray(function(err, result){
			for(i = 0;i < result.length;i++){
				sum += 1; //current voting power is always 1
			}
		});
	});
	totalScore = sum;

}


function getScore(account, cb){
	var vote;
	var sum = 0;
	MongoClient.connect(url, function(err, db) {
		var dbo = db.db("heroku_dg3d93pq");
		var findquery = {account : account};
		dbo.collection("user").find({findquery}).toArray(function(err, result){
			for(i = 0;i < result.length;i++){
				sum += 1; //current voting power is always 1
			}
		});
	});
	vote = sum / totalScore;
								 
	cb(account, vote);
}


function doAirDrop(){
//get total score for each account
	MongoClient.connect(url, function(err, db) {
		var dbo = db.db("heroku_dg3d93pq");
		dbo.collection("user").find({}).toArray(function(err, result){
			if(result == null){
				;//do nothing
			}else{
				for(i = 0;i < result.length; i++){
					//get each score
					getScore(result[i].account, increaseVote);
					//calling increaseVote with calculated score
				}
			}
		});
	});
							
		

}

//getTotalScore, doAirdrop
getTotalScore();
//time must be 24hours
setTimeout(doAirDrop, 1000);

