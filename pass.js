const bcrypt = require('bcrypt');
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;


function passAccount(){
	MongoClient.connect(url, function(err, db) {
					if (err){
				console.log(err);
				throw err;
			}
   		var dbo = db.db("heroku_dg3d93pq");
   		
   		dbo.collection("user").find().toArray(function(err, data){
			if (err){
				console.log(err);
				throw err;
			}
			console.log(data);
			console.log("res",data.length);			
      			for(i = 0; i < data.length ; i++){
				setHash(data[i]);
			}			
		});
	});          						
}

function setHash(data){
	MongoClient.connect(url, function(err, db) {
		var dbo = db.db("heroku_dg3d93pq");
		
	        			bcrypt.hash(data.pass, process.env.SALT, function(err, hash){
          				var newValue = hash;
					var myobj = { $set: {pass : newValue}};
					var findquery = { account : data.account };
            				dbo.collection("user").updateOne(findquery, myobj, function(err,result){
						if (err){
							console.log(err);
							throw err;
						}else{
							;
						}

            				});
				});
}

passAccount();


