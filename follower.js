const mongo = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI;


exports.createFriend = function(account, friend, callback){
  MongoClient.connect(url, function(err, db) {
	  const dbo = db.db("heroku_dg3d93pq");
	  const myObj = {account : account, follower : friend};
	  dbo.collection("follower").insertOne(myObj, function(err, res){
		  if (err) throw err;
		  console.log("1 follower inserted", account, friend);
		  callback("OK");
		  db.close();
	  });
  });  
}

exports.readFriends = function(account,callback){
	MongoClient.connect(url, function(err, db) {
	  const dbo = db.db("heroku_dg3d93pq");
	  const findQuery = {account : account};
	  dbo.collection("follower").find(findQuery).toArray(function(err, res){
		  if (err) throw err;
		  console.log("reading follower", res.length);
		  //make body
		  var body = [];
		  for(i = 0;i < res.length; i++){
			  body.push({ data : res[i].friend });
		  }		  
		  callback(body);
		  db.close();
	  });
  });  
}

exports.deleteFriend = function(account, callback){
	MongoClient.connect(url, function(err, db) {
		const dbo = db.db("heroku_dg3d93pq");
		const deleteQuery = {account : account, follower : friend};
		dbo.collection("follower").deleteOne(deleteQuery, function(err, res){
			if (err) throw err;
			console.log("1 follower deleted", account, friend);
			callback("OK");
			db.close();
		});
	});
}


