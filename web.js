//require("./steembot");




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

//return done, fail and duplicated
function saveAccount(account, pass){
	MongoClient.connect(url, function(err, db) {
   		var dbo = db.db("heroku_dg3d93pq");
		var tod = Date.now();

   		var myobj = { account : account, pass : pass, date : tod, wallet : 0, profile : "8.png" };
   		dbo.collection("user").insertOne(myobj, function(err, res){
    			if (err) throw err;
    			console.log("1 user inserted");
    			db.close();   
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


function increaseVote(id, vote){
	  MongoClient.connect(url, function(err, db) {
   		 var dbo = db.db("heroku_dg3d93pq");
    		var findquery = {_id : ObjectId(id)};		  
    		dbo.collection("board").findOne(findquery, function(err, result){
     			 if(result == null){
      			//if result is null, then return -1
      			//do nothing
	     		 console.log("nothing to increase vote");
      		}else{
      			//calling write reply
			increasePay(result.account, 1);
	      		var orig = result.voting;
	      		var newValue = parseInt(vote,10) + parseInt(orig,10);
			console.log("increaseVote",orig, vote);
	      		var newvalues = { $set: {voting : newValue } };
	      		dbo.collection("board").updateOne(findquery, newvalues, function(err, result){
		      		if (err) throw err;
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
				cb(res.wallet);
			else
				cb(0)				
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
    			if (res != null)
			    cb(true);
			else
				cb(false)				
    			db.close();   
   		});
  	}); 	
}

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
			   },
			  {$sort: {"date" : -1}}
			];
		
		dbo.collection("board").aggregate(agr).toArray(function(err, result){
			    			if (err) throw err;
			var body = []; // empty array
			var picUrl;
			//console.log("Readdata size", result.length);
			//onsole.log("before for loop");
			for(i = 0; i < result.length ; i++){				
				//console.log("in for loop");
				if(result[i].userdetails[0] == undefined){
					picUrl = "0.png";
					//console.log("undefined case");
				}
				else{
					//console.log("define case");
					picUrl = result[i].userdetails[0].profile
				body.push({id: result[i]._id, account: result[i].account, data : result[i].data, date : result[i].date,
					  voting : result[i].voting,  profile : picUrl });
				}
			}
			//onsole.log("after for loop");

			//make result for reading
			/*
		        var body = {
			  "id": result._id,
			  "account" : result.account,
			  "data" : result.data,
			  "date" : result.date,
			  "voting" : result.voting,
			  "profile" : "image7.png"
	  	        };*/
										     
										     
										     
			/*
			console.log("join table", result.userdetails);
			console.log("test2", result.profile);
    			console.log("read complete");
		        console.log(body);
			*/
			//console.log(body);
			cb(body);
    			db.close();   
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

  app.post("/user/add", function(req, res) { 
	/* some server side logic */
	  console.log("user add event");
	res.send("OK");
  });

  app.post("/write", function(req, res) { 
	  
	/* some server side logic */

	  var user = req.body.user;
	  var data = req.body.data;
	  console.log("write event", user, data);
	  //save this data to mongoDB//
	  saveData(user, data);
	  res.send("done");
  });

  app.post("/getWallet", function(req, res) { 
	  
	/* some server side logic */

	  var user = req.body.user;
	  console.log("get Wallet", user);
	  //read wallet info and send the result
	  readWallet(user, (result) => {
		  var body = {
			  "result": "done",
			  "balance" : result
	  	  };
		  res.send(body);
	  });
  });

  app.post("/register", function(req, res) { 
	  
	/* some server side logic */

	  var id = req.body.id;
	  var pass = req.body.pass;
	  console.log("register event", id, pass);
	  //save this data to mongoDB//
	  saveAccount(id, pass);
	  res.send("done");
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
	  increaseVote(id, vote);
	  res.send("done");
  });

  app.post("/read", function(req, res) { 
	/* some server side logic */
	  
	  var user = req.body.user;
	  var page = req.body.page;
	  console.log("read event", user, page);
	  //query Mongo DB
	  readData(user, page,(result) => {res.send(result)});
	  

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
