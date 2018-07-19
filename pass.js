const bcrypt = require('bcrypt');
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;


function passAccount(){
	MongoClient.connect(url, function(err, db) {
   		var dbo = db.db("heroku_dg3d93pq");
   		
   		dbo.collection("user").find({}).toArray(function(err, res){
      			for(i = 0;i< res.length;i++){
        			bcrypt.hash(res[i].pass, process.env.SALT, function(err, hash){
          			var newValue = hash;
          			var myobj = { $set: {pass : newValue}};
					var findquery = { account : res[i].account };
            			dbo.collection("user").updateOne(findquery, myobj, function(err,result){
            				db.close();
            			});
				});
			}
		});
	});
					      
    			
}

passAccount();


