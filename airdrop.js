
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;

function airDrop(){
	  MongoClient.connect(url, function(err, db) {
   		 var dbo = db.db("heroku_dg3d93pq");
	  
    		dbo.collection("user").find(findquery).toArray(function(err, result){
     			 if(result == null){
					 console.log("nothing to increase pay");
					 db.close();
      			}else{
				for(i = 0;i<result.length;i++){
					var findquery = {account : result[i].account};			
	      				var newvalues = { $set: {wallet : 100 } };
	      				dbo.collection("user").updateOne(findquery, newvalues, function(err, result){
		      				if (err) throw err;
	      		        		db.close();
					});
				}
			}
		});
	  });
}
			

airDrop();
