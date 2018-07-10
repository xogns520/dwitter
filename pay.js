//mongo DB
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;

function increasePay(id, vote, myValue, totalValue){
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
      var incValue = (myValue/totalValue) * process.env.dropsize;
			newValue += (parseInt(result.wallet, 10) + incValue);
	      		var newvalues = { $set: {wallet : newValue } };
	      		dbo.collection("user").updateOne(findquery, newvalues, function(err, result){
		      		if (err) throw err;
	      		        db.close();
      			});
      		}
    
        	});
        });
}


function doAirDrop(){
//get total score for each account
MongoClient.connect(url, function(err, db) {

}
