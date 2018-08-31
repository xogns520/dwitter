const mongo = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI;


exports.addReply = function(account, parentid, data){
	MongoClient.connect(url, function(err, db) {
		var dbo = db.db("heroku_dg3d93pq");
		var tod = Date.now();
		var myobj = { account : account, data : data, date : tod, voting : 0, payout : 0, steem : false, parentid : parentid};
		dbo.collection("board").insertOne(myobj, function(err, res){
			if (err) throw err;
			console.log("1 reply inserted");
			db.close();
		});
	});
}

exports.readDetailPage = function(postid, account, page, cb){
	console.log("in reaData", account, page);
	MongoClient.connect(url, function(err, db) {
   		var dbo = db.db("heroku_dg3d93pq");
		var tod = Date.now();
		//ToDo : add image path to response
   		//dbo.collection("board").find({}).sort({date: -1}).toArray(function(err, result){
		
		var agr = [	
			{ $match: { $or:[{_id : ObjectId(postid)},{ parentid : postid}] }},
			{ $lookup:
			    { from: 'user',
			   localField: 'account',
			   foreignField : 'account',
			   as : 'userdetails'
			    }
			   }
			];
		
		dbo.collection("board").aggregate(agr).toArray(function(err, result){
			    			if (err) throw err;
			var body = []; // empty array
			var picUrl;
			console.log("Readdata size", result.length);
			//console.log("aggregate data", result);
			//onsole.log("before for loop");
			
			for(i = 0; i < result.length ; i++){				
				//console.log("in for loop");
				if(result[i].userdetails[0] == undefined){
					picUrl = "0.png";
					//console.log("undefined case");
				}
				else{
					//console.log("define case");
					var picUrl = result[i].userdetails[0].profile;
				}
				

				const votingenable = "true";				
				body.push({id: result[i]._id, account: result[i].account, data : result[i].data, date : result[i].date,
					  voting : result[i].voting,  profile : picUrl, votingenable : votingenable });
				
			}
			//generating votingenable flag
			var findQuery = { account : account };
			dbo.collection("voting").find(findQuery).toArray(function(err, votingTable){
				if(err) throw err;
				console.log("voting table query result",votingTable.length, account, body.length);
				for(i = 0;i < body.length;i++){
					for(j = 0;j<votingTable.length;j++)
						if(body[i].id == votingTable[j].boardId){
							body[i].votingenable = "false";
							break;
						}
				}
				cb(body);
    				db.close();   
			});
   		});
  	}); 
}
