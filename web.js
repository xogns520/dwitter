var express = require('express');
var bodyParser     =        require("body-parser");
var app = express();
var path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//mongo DB
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;

// set the view engine to ejs
//app.set('view engine', 'ejs');
//app.set('views',"examples/views");


//custom functions
function saveData(account, data){
	MongoClient.connect(url, function(err, db) {
   		var dbo = db.db("heroku_dg3d93pq");
		var tod = Date.now();

   		var myobj = { account : account, data : data, date : tod, voting : 0, payout : 0 };
   		dbo.collection("board").insertOne(myobj, function(err, res){
    			if (err) throw err;
    			console.log("1 document inserted");
    			db.close();   
   		});
  	}); 
}

// use res.render to load up an ejs view file


 /* serves main page */
 app.get("/", function(req, res) {
    res.sendfile('index.html')
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

  app.post("/read", function(req, res) { 
	/* some server side logic */
	  
	  var user = req.body.user;
	  var page = req.body.page;
	  console.log("read event", user, page);
	  //query Mongo DB
	res.send("OK");
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
