var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views',"examples/views");

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
	getRank(function(drinks){
		console.log("in appget",drinks);
		var tagline = "TBD";
    		res.render('pages/index', {
        	drinks: drinks,
        	tagline: tagline
    		});
		
	});
	//console.log(drinks);
	/***
    var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
    ***/

});



app.listen(process.env.PORT);
