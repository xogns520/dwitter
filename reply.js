const mongo = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI;


exports.addReply = function(account, parentId){
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

exports.readDetailPage = function(postid, cb){
	var body = [];
	var picUrl;
	
	//read main post
	MongoClient.connect(url, function(err, db) {
		var dbo = db.db("heroku_dg3d93pq");
		var findQuery = { _id : ObjectId(postid)};
		dbo.collection("board").findOne(findQuery, function(err, item){
			const votingenable = "true";
			body.push({id: item._id, account: item.account, data : item.data, date : item.date,
					   voting : result[i].voting,  profile : picUrl, votingenable : votingenable, parentid : 0 });
			//read replies
			var findReplyQuery = { parentId : ObjectId(postid)};
			dbo.collection("board").find(findReplyQuery).toArray(function(err, replies){
				if(replies.length == 0){
					cb.
					db.close();
				}
			
		});
	});

	MongoClient.connect(url, function(err, db) {
		var dbo = db.db("heroku_dg3d93pq");
		var agr = [
			{ $match : { _id : ObjectId(postid)}, 
			{ $lookup:
			    { from: 'user',
			   localField: 'account',
			   foreignField : 'account',
			   as : 'userdetails'
			    }
			   },

			  {$sort: {"date" : -1}}			
			];
		
		dbo.collection("board").aggregate(agr).toArray(function(err, result){
			if (err) throw err;
			var body = [];
			var picUrl;
			for(i = 0; i < result.length ; i++){
				if(result[i].userdetails[0] == undefined){
					picUrl = "0.png";
				}else{
					var picUrl = result[i].userdetails[0].profile;
				}
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
