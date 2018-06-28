var express = require('express');
var app = express();
var path = require('path');

// set the view engine to ejs
//app.set('view engine', 'ejs');
//app.set('views',"examples/views");

// use res.render to load up an ejs view file


 /* serves main page */
 app.get("/", function(req, res) {
    res.sendfile('index.htm')
 });

  app.post("/user/add", function(req, res) { 
	/* some server side logic */
	res.send("OK");
  });

 /* serves all the static files */
 app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
     res.sendfile( __dirname + req.params[0]); 
 });

 var port = process.env.PORT || 5000;
 app.listen(port, function() {
   console.log("Listening on " + port);
 });
