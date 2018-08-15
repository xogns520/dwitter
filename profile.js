const mongo = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI;

exports.setProfilePicture = function(account, picUrl, callback){
	MongoClient.connect(url, function(err, db) {
		const dbo = db.db("heroku_dg3d93pq");
		const myObj = { $set : { account : account, profile : picUrl}};
		const findQuery = {account : account};
		dbo.collection("user").updateOne(findQuery, myObj, function(err, res){
			if(err) throw err;
			callback("success");
			db.close();
		});
	});
}

exports.getProfilePicture = function(account, callback){
	MongoClient.connect(url, function(err, db) {
		const dbo = db.db("heroku_dg3d93pq");
		const findQuery = {account : account};
		dbo.collection("user").findOne(findQuery, function(err, res){
			if(err) throw err;
			callback(res.profile);
			db.close();
		});
	});
}