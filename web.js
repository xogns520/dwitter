//require("./steembot");
//require("./pass");

const airdrop = require("./airdrop");
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb');

const follower = require("./follower");
const profile = require("./profile");
const contract = require("./contract");
const reply = require("./reply");

const nabul = require("./nabul");


var express = require('express');
var bodyParser     =        require("body-parser");
var app = express();
var path = require('path');
var session = require('express-session')
var MongoDBStore = require('connect-mongodb-session')(session);

var store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'mySessions'
});

store.on('connected', function() {
  store.client; // The underlying MongoClient object from the MongoDB driver
});

// Catch errors
store.on('error', function(error) {
  assert.ifError(error);
  assert.ok(false);
});



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//mongo DB
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;

// set the view engine to ejs
//app.set('view engine', 'ejs');
//app.set('views',"examples/views");

// Use the session middleware
app.use(require('express-session')({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));


//custom functions
function saveData(account, data){
	MongoClient.connect(url, function(err, db) {
   		var dbo = db.db("heroku_dg3d93pq");
		var tod = Date.now();

   		var myobj = { account : account, data : data, date : tod, voting : 0, payout : 0, steem : false };
   		dbo.collection("board").insertOne(myobj, function(err, res){
    			if (err) throw err;
    			console.log("1 document inserted");
    			db.close();   
   		});
  	}); 
}

function editData(postid, data, cb){
	//ToDo : payout data condition check
	MongoClient.connect(url, function(err, db) {
		var dbo = db.db("heroku_dg3d93pq");
		var myobj = { $set : {data : data}};
		var findquery = {_id : ObjectId(postid)};
		dbo.collection("board").updateOne(findquery, myobj, function(err, res){
			if (err) throw err;
			console.log("1 document modified");
			cb("success");
			db.close()
		});
	});
}

//return done, fail and duplicated
function saveAccount(account, pass, callback){
	MongoClient.connect(url, function(err, db) {
   		var dbo = db.db("heroku_dg3d93pq");
		var tod = Date.now();
		bcrypt.hash(pass, parseInt(process.env.SALT,10), function(err, hash){
			var myobj = { account : account, pass : hash, date : tod, wallet : 0, profile : "https://res.cloudinary.com/hgnmrexj6/image/upload/v1534433033/NoneProfilePic.png" };
   			dbo.collection("user").insertOne(myobj).then(function(res){
    				console.log("1 user inserted");
				callback("done");
    				db.close();   
			}).catch(function(e){
				console.log('catch in test');
				callback("duplicated");
				db.close();
				console.log(e);	
				throw e;
			});
		});
  	}); 
}

function readTotalUser(cb){
	MongoClient.connect(url, function(err, db) {
		var dbo = db.db("heroku_dg3d93pq");
		var col = dbo.collection("user");
		col.count({}, function(err, count){
			console.log("readTotalUser", count);
			var body = {
			  "count": count
			}
			db.close();
			cb(body);
		});
	});
}

function increasePay(id, vote){
	console.log("increasePay",id);
	  MongoClient.connect(url, function(err, db) {
   		 var dbo = db.db("heroku_dg3d93pq");
    		var findquery = {account : id};		  
    		dbo.collection("user").findOne(findquery, function(err, result){
     			 if(result == null){
      			//if result is null, then return -1
      			//do nothing
	     		 console.log("nothing to increase pay");
      		}else{

			var newValue = 0;
			newValue += (parseInt(result.wallet, 10) + 1);
	      		var newvalues = { $set: {wallet : newValue } };
	      		dbo.collection("user").updateOne(findquery, newvalues, function(err, result){
		      		if (err) throw err;
	      		        db.close();
      			});
      		}
    
        	});
        });
}


function increaseVote(id, vote, account){
	  MongoClient.connect(url, function(err, db) {
   		 var dbo = db.db("heroku_dg3d93pq");
    		var findquery = {_id : ObjectId(id)};		  
    		dbo.collection("board").findOne(findquery, function(err, res){
     			 if(res == null){
      			//if result is null, then return -1
      			//do nothing
	     		 console.log("nothing to increase vote");
      			}else{
      				//calling write reply
				//This is directly increasing account's wallet.
				//increasePay(res.account, 1);
				//contract.voteMessage(account, res.account, id);
	      			var orig = res.voting;
	      			var newValue = parseInt(vote,10) + parseInt(orig,10);
				console.log("increaseVote",orig, vote);
	      			var newvalues = { $set: {voting : newValue } };
	      			dbo.collection("board").updateOne(findquery, newvalues, function(err, result){
		      			if (err) throw err;
	      		        	db.close();
      				});
				var tod = Date.now();

   				var myobj = { boardId : id,  account : account , date : tod };
   				dbo.collection("voting").insertOne(myobj, function(err, res){
    					if (err) throw err;
    					console.log("1 document inserted");
    					db.close();   
   				});
			}
      		
    
        	});
        });

}

function readWallet(user, cb){
	MongoClient.connect(url, function(err, db) {
   		var dbo = db.db("heroku_dg3d93pq");
   		var findquery = { account : user };
   		dbo.collection("user").findOne(findquery, function(err, res){
    			if (err) throw err;
    			if (res != null)
				cb(res.wallet, res.walletAccount);
			else
				cb(-1,-1)				
    			db.close();   
   		});
  	}); 	
}

function setWallet(user, walletAccount, cb){
	MongoClient.connect(url, function(err, db) {
		var dbo = db.db("heroku_dg3d93pq");
		var updatequery = { account : user };
		var myObj = { $set : { walletAccount : walletAccount}};
		dbo.collection("user").updateOne(updatequery, myObj, function(err, res){
			if (err){
				cb("fail");
				throw err;
			}
			cb("OK");
			db.close();
		});
	});
		
		
}

function compareAccount(id, pass, cb){
	MongoClient.connect(url, function(err, db) {
   		var dbo = db.db("heroku_dg3d93pq");
   		var findquery = { account : id };
   		dbo.collection("user").findOne(findquery, function(err, res){
    			if (err) throw err;
    			if (res != null){
				bcrypt.compare(pass, res.pass, function(err, result){
					if(result)
			    			cb(true);
					else
						cb(false);
				});
			}
			else
				cb(false)				
    			db.close();   
   		});
  	}); 	
}

function readVote(id,cb){
	MongoClient.connect(url, function(err, db) {
   		var dbo = db.db("heroku_dg3d93pq");
   		var findquery = { account : id };
   		dbo.collection("voting").find(findquery).toArray(function(err, res){
    			if (err) throw err;
    				if (res != null)
			    		cb(res);
				else
					cb("fail");				
    			db.close();   
   		});
  	}); 	
}

function setPassword(id,oldPass,newPass,cb){
	//compare current password
	//set new password
	MongoClient.connect(url, function(err, db) {
		var dbo = db.db("heroku_dg3d93pq");
		var findquery = { account : id };
		dbo.collection("user").findOne(findquery,function(err, res){
			bcrypt.compare(oldPass, res.pass, function(err, result){
				if(result){
					bcrypt.hash(newPass, parseInt(process.env.SALT,10), function(err, hash){
						if(hash){
							cb("OK");
							var myobj = { $set:{pass : hash}};
							dbo.collection("user").updateOne(findquery, myobj, function(err,result){
								console.log("password updated", id);
								db.close();
							});
						}
						else{
							cb("fail");
							db.close();
						}
						});
	
				}else{
					cb("fail");
					db.close();
				}
			});
		});
	});	
}



function readData(account, page, cb){
	console.log("in reaData", account, page);
	MongoClient.connect(url, function(err, db) {
   		var dbo = db.db("heroku_dg3d93pq");
		var tod = Date.now();
		//ToDo : add image path to response
   		//dbo.collection("board").find({}).sort({date: -1}).toArray(function(err, result){
		
		var agr = [	
			{ $lookup:
			    { from: 'user',
			   localField: 'account',
			   foreignField : 'account',
			   as : 'userdetails'
			    }
			   },

			  {$sort: {"date" : -1}},
			{$skip : (20 * page) - 20},
			   {$limit : 20}
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

// use res.render to load up an ejs view file


 /* serves main page */
 app.get("/", function(req, res) {
    res.sendfile('index.html')
 });

 app.get("/about", function(req, res) {
    res.sendfile('./about/about.html')
 });

 app.get("/intro", function(req, res) {
    res.sendfile('./intro/index.html')
 });

  app.post("/user/add", function(req, res) { 
	/* some server side logic */
	  console.log("user add event");
	res.send("OK");
  });

  app.post("/addreply", function(req, res) { 
	  
	/* some server side logic */

	  var user = req.session.account;
	  var data = req.body.data;
	  var parentid = req.body.parentid
	  console.log("addreply event", user, data, parentid);
	  //save this data to mongoDB//
	  reply.addReply (user, data);
	  res.send("done");
	  contract.sendMessage(user, data);
  });

  app.post("/write", function(req, res) { 
	  
	/* some server side logic */

	  var user = req.body.user;
	  var data = req.body.data;
	  console.log("write event", user, data);
	  //save this data to mongoDB//
	  saveData(user, data);
	  res.send("done");
	  contract.sendMessage(user, data);
  });


  app.post("/getWallet", function(req, res) { 
	  
	/* some server side logic */

	  var user = req.body.user;
	  console.log("get Wallet", user);
	  //read wallet info and send the result
	  readWallet(user, (result, result2) => {
		  var body = {
			  "result": "done",
			  "balance" : result,
			  "account" : result2
	  	  };
		  if(result != -1){
			  body.result = "OK";

		  }else{
			  body.result = "fail";
		  }
		  res.send(body);
	  });
  });

  app.post("/setwallet", function(req, res) { 
	  const walletAccount = req.body.account;
	  console.log("setwallet event", walletAccount);
	  setWallet(req.session.account, walletAccount, (result)=>{
		  res.send(result);
	  });
  });

  app.post("/createfriend", function(req, res) { 
	  const friend = req.body.account;
	  console.log("createfriend event", friend);
	  follower.createFriend(req.session.account, friend, (result)=>{
		  res.send(result);
	  });
  });

  app.post("/deletefriend", function(req, res) { 
	  const friend = req.body.account;
	  console.log("deletefriend event", friend);
	  follower.deleteFriend(req.session.account, friend, (result)=>{
		  res.send(result);
	  });
  });

  app.post("/readfriends", function(req, res) { 
	  console.log("readfriends event");
	  follower.readFriends(req.session.account,(result)=>{
		  res.send(result);
	  });
  });

	  
  app.post("/register", function(req, res) { 
	  
	/* some server side logic */

	  var id = req.body.id;
	  var pass = req.body.pass;
	  console.log("register event", id, pass);
	  //save this data to mongoDB//
	  saveAccount(id, pass, (result)=>{
		  res.send(result);
	  });
  });

  app.post("/isLogin", function(req, res) { 
	  
	/* some server side logic */
	  if(req.body.id != undefined && req.body.id != null ){
	  	var id = req.body.id;
	  	console.log("isLogin event", id);
	  }else{
		  id = "__undefined";
	  }
	  
	  var body = {
			  "result": null,
			  "id" : null
	  };
	  
	  console.log("isLogin",req.session.account,id);
	 
	  if(req.session.isLogin == true){
		  var body;
		  body.result = "true";
		  body.id = req.session.account;
	  	  res.send(body)
	  }
	  else{
		  var body;
		  body.result = "fail";
		  body.id = "null";
	  	  res.send(body)
	  }
  });

  app.post("/login", function(req, res) { 
	  var id = req.body.id;
	  var pass = req.body.pass;
	  //save id information

	  console.log("login event", id, pass);
	  //make session and return number//
	  compareAccount(id, pass, (result) => {
		  if(result == true){
			  //make session and return
			  console.log("login with session id", req.session.id);
			  req.session.account = id;
			  req.session.isLogin = true;
			  res.send(req.session.id);
		  }else{
			  //error case
			  res.send("fail");
		  }
	  });
		 

  });

  app.post("/logout", function(req, res) { 
	  
	/* some server side logic */

	  var id = req.body.id;
	  req.session.isLogin = false;
	  console.log("logout event");

	  res.send("done");
  });

  app.post("/vote", function(req, res) { 
	  
	/* some server side logic */

	  var id = req.body.id;
	  var vote = req.body.vote;
	  console.log("vote event", id, vote);
	  //save this data to mongoDB//
	  increaseVote(id, vote, req.session.account);
	  res.send("done");
  });

  app.post("/readvote", function(req, res) { 
	  
	/* some server side logic */

	  var id = req.body.id;
	  var vote = req.body.vote;
	  console.log("read vote");
	  //save this data to mongoDB//
	  readVote(req.session.account,(result) => {res.send(result)});
  });

 app.post("/setprofilepicture", function(req, res) { 
	 var url = req.body.url;
	 console.log("setprofilepicture", url);
	 profile.setProfilePicture(req.session.account, url,
				    (result) => {res.send(result)});
 });

 app.post("/getprofilepicture", function(req, res) { 
	 console.log("getprofilepicture");
	 profile.getProfilePicture(req.session.account,
				    (result) => {res.send(result)});
 });

 app.post("/getbalance", function(req, res) { 
	 console.log("getbalance");
	 contract.getTokenBalanceEach (req.session.account, "eoscafekorea",
				    (result) => {res.send(result)});
 });

 app.post("/transferbalance", function(req, res) { 
	 console.log("transferbalance");
	 contract.sendDab(req.session.account,
				    (result) => {res.send(result)});
 });






  app.post("/readtotaluser", function(req, res) { 
	  
	/* some server side logic */

	  console.log("readtotaluser");
	  readTotalUser((result) => {res.send(result)});
  });

  app.post("/setpassword", function(req, res) { 
	  
	/* some server side logic */
	  oldPass = req.body.oldpass;
	  newPass = req.body.newpass;
	  console.log("setpassword", oldPass, newPass, req.session.account);

	  setPassword(req.session.account, oldPass, newPass, (result) => {res.send(result)});
  });


  app.post("/read", function(req, res) { 
	/* some server side logic */
	  
	  var user = req.body.user;
	  var page = req.body.page;
	  console.log("read event", user, page);
	  //query Mongo DB
	  if(page == 0)
	  	req.session.page = page + 1;
	  else if(page == -1)
		  req.session.page++;
	  else if(page == -2){
		  req.session.page--;
		  if(req.session.page == 0)
			  req.session.page = 1;
	  }
	  else
		  req.session.page = page;
	  console.log("calling readData", req.session.account);
	  readData(req.session.account, req.session.page,(result) => {res.send(result)});
  });

  app.post("/readnabul", function(req, res) { 
	/* some server side logic */
	  
	  var user = req.body.user;
	  var page = req.body.page;
	  console.log("readnabul event", user, page);
	  //query Mongo DB
	  if(page == 0)
	  	req.session.page = page + 1;
	  else if(page == -1)
		  req.session.page++;
	  else if(page == -2){
		  req.session.page--;
		  if(req.session.page == 0)
			  req.session.page = 1;
	  }
	  else
		  req.session.page = page;
	  
	  if(req.session.page < 0){
		  console.log("page number correction", req.session.page);
		  req.session.page = 1;
	  }
	  
	  console.log("calling readNabul", req.session.account, req.session.page);
	  nabul.readNabul(req.session.account, req.session.page,(result) => {res.send(result)});
  });

  app.post("/readdetailpage ", function(req, res) { 
	/* some server side logic */
	  
	  var user = req.body.user;
	  var page = req.body.page;
	  var postid = req.body.postid;
	  console.log("readdetailpage  event", postid, user, page);
	  //query Mongo DB
	  if(page == 0)
	  	req.session.page = page + 1;
	  else if(page == -1)
		  req.session.page++;
	  else if(page == -2){
		  req.session.page--;
		  if(req.session.page == 0)
			  req.session.page = 1;
	  }
	  else
		  req.session.page = page;
	  
	  if(req.session.page < 0){
		  console.log("page number correction", req.session.page);
		  req.session.page = 1;
	  }
	  
	  console.log("calling readdetailpage ", postid, req.session.account, req.session.page);
	  reply.readDetailPage (postid, req.session.account, req.session.page,(result) => {res.send(result)});
  });

  app.post("/edit", function(req, res) { 
	/* some server side logic */
	  
	  var postid = req.body.postid;
	  var data = req.body.data;
	  console.log("edit event", postid, data);
	  //query Mongo DB
	  editData(postid, data,(result) => {res.send(result)});
  });


  app.post("/isairdrop", function(req, res) { 
	/* some server side logic */
	  
	  const account = req.body.account;
	  console.log("isairdrop event", account);
	  //query Mongo DB
	  airdrop.isAirDrop(account,(result) => {res.send(result)});
  });

 /* serves all the static files */
 app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
     res.sendfile( __dirname + req.params[0]); 
 });

 var port = process.env.PORT || 5000;
console.log("port", port);

 app.listen(port, function() {
   console.log("Listening on " + port);
 });
