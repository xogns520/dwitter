
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;
var url2 = process.env.MONGODB_URI2;

function airDrop(){
	  MongoClient.connect(url, function(err, db) {
   		 var dbo = db.db("heroku_dg3d93pq");
	  
    		dbo.collection("user").find({}).toArray(function(err, result){
     			 if(result == null){
					 console.log("nothing to increase pay");
					 db.close();
      			}else{
				for(i = 0;i<result.length;i++){
					var findquery = {account : result[i].account};			
	      				var newvalues = { $set: {wallet : 150 } };
	      				dbo.collection("user").updateOne(findquery, newvalues, function(err, result){
		      				if (err) throw err;
	      		        		db.close();
					});
				}
			}
		});
	  });
}


			
exports.isAirDrop = function(account, callback){
	MongoClient.connect(url2, function(err, db) {
		const dbo = db.db("heroku_23gbks9t");
		const findQuery = {account : account};
		dbo.collection("snapshot0824").findOne(findQuery, function(err, resFind){
			if(resFind != null){
				callback("success");
				 db.close();
			}else{
				callback("fail");
				db.close();
			}
		});
	});				
}

