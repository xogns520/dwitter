var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;

function readData(account, page, cb){
	MongoClient.connect(url, function(err, db) {
   		var dbo = db.db("heroku_dg3d93pq");
		var tod = Date.now();
		//ToDo : add image path to response
   		//dbo.collection("board").find({}).sort({date: -1}).toArray(function(err, result){

		var agr = [{ $lookup:
			    { from: 'user',
			   localField: 'account',
			   foreignField : 'account',
			   as : 'userdetails'
			    }
			   }//,
			  //{$sort: {"date" : -1}}
			]
		dbo.collection("board").aggregate(agr).toArray(function(err, result){
    			if (err) throw err;
			//make result for reading
		        var body = {
			  "id": result._id,
			  "account" : result.account,
			  "data" : result.data,
			  "date" : result.date,
			  "voting" : result.voting,
			  "profile" : "image7.png"
	  	        };
			/*
			console.log("join table", result.userdetails);
			console.log("test2", result.profile);
    			console.log("read complete");
		        console.log(body);
			*/

			cb(result);
    			db.close();   
   		});
  	}); 
}



readData("test", 1,(result) => {
	//if(result.userdetails != undefined && result.userdetails != null)
		console.log("teddy userdetails", result[0].userdetails);
	//console.log(result)
});
