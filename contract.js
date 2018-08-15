//mongo DB
var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;

const Eos = require('eosjs');

config = {
  chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906", // 32 byte (64 char) hex string
  keyProvider: process.env.key, // WIF string or array of keys..
  httpEndpoint: 'https://mainnet.eoscalgary.io',
  expireInSeconds: 60,
  broadcast: true,
  verbose: false, // API activity
  sign: true
}

eos = Eos(config);


function transfer(from, to, amount, msg){
	eos.transaction("eoscafekorea", myaccount => {
	myaccount.transfer(from,to, amount + " " + "DAB", msg);
	});
}

exports.sendMessage = function(account, msg){  
  const adMsg = "Please visit https://dabble.cafe";
	var resultMsg;
  var maxLength = 255 - adMsg.length - 20 - account.length;
  maxLength = maxLength < msg.length ? maxLength : msg.length;
	resultMsg = adMsg;
		resultMsg += " id " + account;
	resultMsg += " data : " + msg;
  transfer("eoscafekorea","awesometeddy",0.0001, resultMsg.substring(0,236));  
}


		
	
exports.sendDab = function(account, callback){
	//transfer DAB to real EOS account
	//success : reset wallet count to zero
	//fail : do nothing and show fail popup
	MongoClient.connect(url, function(err, db) {
		const dbo = db.db("heroku_dg3d93pq");
		const findQuery = {account : account};
		dbo.collection("user").findOne(findQuery, function(err, resFind){
			 if(err) throw err;
			 const sendAmount = resFind.wallet;
			 transfer("eoscafekorea",account,sendAmount, "https://dabble.cafe daily airdrop").then((output)=>{
				 	callback("success");
				 const updateQuery = {account : account};
				 const myObj = {$set : {wallet : "0"}};
				 dbo.collection("user").updateOne(updateQuery, myObj,function(err, resFind){
					 if(err) throw err;
					 db.close();
				 }); //end of updateOne
				 }).catch((err)=>{
				 	db.close();
				 	callback("fail");
				 });			 
		 }); //end of findOne
	}); //end of connect
}

exports.getTokenBalanceEach = async function(account, tokenCode, callback){
	MongoClient.connect(url, function(err, db) {
		const dbo = db.db("heroku_dg3d93pq");
		const findQuery = {account : account};
		dbo.collection("user").findOne(findQuery, function(err, resFind){
			if(err) throw err;
			eosAccount = resFind.walletAccount;
		
	let bal = await eos.getTableRows({json : true,
                      code : tokenCode,
                 	scope: eosAccount,
                 	table: "accounts",
                 	}).catch((err) => {
                  	callback(0)});
 
    if(bal != undefined && bal.rows.length != 0)
     callback(bal.rows[0].balance);
    else
     callback(0);
			db.close();
		});

}





	
