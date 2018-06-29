var steem = require('steem');

//mongo DB
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;

//After writing, this needs cool down time to create the block chain
function writingReply(data){
	child_permlink = "dabbledabble-test";
	var private_posting_wif = process.env.pass;
	var parent_author = "jeaimetu";
	//var parent_author = '';
	var parent_permlink = child_permlink;
	var json_metadata = '';
	//check author have . then remove that
	var parent_author_permlink = "jeaimetu";


	const permlink = steem.formatter.commentPermlink(parent_author_permlink, parent_permlink)
	//const permlink = steem.formatter.commentPermlink('jeaimetu', parent_permlink)
	var content = data;
	
	steem.broadcast.comment (
    	private_posting_wif,  // Steemit.com Wallet -> Permissions -> Show Private Key (for Posting)
    	parent_author,        // empty for new blog post 
    	parent_permlink,      // main tag for new blog post
    	'jeaimetu',               // same user the private_posting_key is for
    	permlink,             // a slug (lowercase 'a'-'z', '0'-'9', and '-', min 1 character, max 255 characters)
    	'',                // human-readable title
    	content,                 // body of the post or comment
    	json_metadata,          // arbitrary metadata
		function (err, result){
			if(err)
				console.log('Failure', err);
			else{
				console.log('Success');
				//update mongo DB
			}
		}
		);
		
}

function readData(){
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("heroku_dg3d93pq");
    var findquery = {steem : false};
    dbo.collection("board").findOne(findquery, function(err, result){
      if(result == null){
      //if result is null, then return -1
      //do nothing
	      console.log("nothing to write");
      }else{
      //calling write reply
	      console.log(result._id.$oid);
	      console.log(result._id);
	      console.log(result._id.oid);
	      writingReply(result.data);
      }
        db.close();
        });
        });

}


function checkReplies() {
	steem.api.getContentReplies('jeaimetu', process.env.link, function(err, result){
		//console.log(err, result);
		result.forEach((num, idx)=> {
			//sleep.sleep(21); //do not work what I intended
			console.log(num.body);
			if(num.children == 0){
				var string = "타로";
				if(num.body.indexOf(string) != -1){
					console.log('I will make reply for this');
					console.log('call writingReply for ', idx);
					writingReply(num.permlink, num.author);
				}
			}
		});
	});
}


// according to steemit github
// https://github.com/steemit/steem/blob/master/libraries/protocol/include/steemit/protocol/config.hpp
// #define STEEMIT_MIN_REPLY_INTERVAL              (fc::seconds(20)) // 20 seconds
// So I safely add 22secs interval consider delay time.
setInterval(readData, 22000);


