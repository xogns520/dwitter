const bcrypt = require('bcrypt');
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;


function passAccount(){
	MongoClient.connect(url, function(err, db) {
   		var dbo = db.db("heroku_dg3d93pq");
   		
   		dbo.collection("user").find().toArray(function(err, res){
			if (err) throw err;
			console.log(res);
			console.log("res",res.length);
      			for(i = 0;i< res.length;i++){
				id = res[i].account;
				pass = res[i].pass;
        			bcrypt.hash(pass, process.env.SALT, function(err, hash){
          			var newValue = hash;
          			var myobj = { $set: {pass : newValue}};
					var findquery = { account : id };
            			dbo.collection("user").updateOne(findquery, myobj, function(err,result){
					console.log(id, pass, newValue);

            			});
				});
			}
		});
			db.close();
	});
	            			
					      
    			
}

passAccount();


