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

async function transfer2(from, to, amount, memo){
	const myaccount = await eos.contract(from);
	await myaccount.transfer(from, to, amount + " " + "DAB",memo);
}


exports.sendMessage = function(account, msg){  
  const adMsg = "Please visit https://dabble.cafe";
	var resultMsg;
  //var maxLength = 255 - adMsg.length - 20 - account.length;
	//const msgLength = msg.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g,"$&$1$2").length;
  //maxLength = maxLength < msg.length ? maxLength : msg.length;
	resultMsg = adMsg;
	resultMsg += " id: " + account;
	resultMsg += " data: " + msg;
	
		
	MongoClient.connect(url, function(err, db) {
		var dbo = db.db("heroku_dg3d93pq");
		var findquery = { account : account };
		dbo.collection("user").findOne(findquery, function(err, res){
			console.log("send message query result", res);
			if (err) throw err;
			if (typeof res.walletAccount == "undefined"){
				transfer("eoscafekorea","awesometeddy",0.0001, resultMsg.substring(0,80));
				db.close();	
			}else{
				if(res.walletAccount.length == 12){
					transfer2("eoscafekorea", res.walletAccount, 
						  0.0001, resultMsg.substring(0,80)).then((output)=>{
						db.close();
						}).catch((err)=>{
						transfer("eoscafekorea","awesometeddy",0.0001, resultMsg.substring(0,80));
						db.close();
					});
				}else{
					transfer("eoscafekorea","awesometeddy",0.0001, resultMsg.substring(0,80));
				}
			}
		});
	});			

}

exports.voteMessage = function(from,to,msgid){  
	console.log("voteMessage", from, to, msgid);
  const adMsg = "Please visit https://dabble.cafe";
	var resultMsg;
  //var maxLength = 255 - adMsg.length - 20 - account.length;
	//const msgLength = msg.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g,"$&$1$2").length;
  //maxLength = maxLength < msg.length ? maxLength : msg.length;
	resultMsg = adMsg;
	resultMsg += " " + from + " Voted ";
	resultMsg += to + " for " + msgid;
	
		
	MongoClient.connect(url, function(err, db) {
		var dbo = db.db("heroku_dg3d93pq");
		var findquery = { account : to };
		dbo.collection("user").findOne(findquery, function(err, res){
			console.log("send message query result", res);
			if (err) throw err;
			if (res == null || typeof res.walletAccount == "undefined"){
				transfer("eoscafekorea","awesometeddy",0.0001, resultMsg.substring(0,80));
				db.close();	
			}else{
				if(res.walletAccount.length == 12){
					transfer2("eoscafekorea", res.walletAccount, 
						  0.0001, resultMsg.substring(0,80)).then((output)=>{
						db.close();
						}).catch((err)=>{
						transfer("eoscafekorea","awesometeddy",0.0001, resultMsg.substring(0,80));
						db.close();
					});
				}else{
					transfer("eoscafekorea","awesometeddy",0.0001, resultMsg.substring(0,80));
				}
			}
		});
	});			

}




		
	
exports.sendDab = function(account, callback){
	//transfer DAB to real EOS account
	//success : reset wallet count to zero
	//fail : do nothing and show fail popup
	console.log("sendDab", account);
	MongoClient.connect(url, function(err, db) {
		const dbo = db.db("heroku_dg3d93pq");
		const findQuery = {account : account};
		dbo.collection("user").findOne(findQuery, function(err, resFind){
			 if(err) throw err;
			console.log("sendDab findquery result", resFind);
			 const sendAmount = resFind.wallet;
			console.log("calling transfer2", resFind.walletAccount, sendAmount);
			 transfer2("eoscafekorea", resFind.walletAccount, sendAmount, "https://dabble.cafe daily airdrop").then((output)=>{

				 const updateQuery = {account : account};
				 const myObj = {$set : {wallet : "0"}};
				 dbo.collection("user").updateOne(updateQuery, myObj,function(err, resFind){
					 if(err) throw err;
					 db.close();
					 callback("success");
				 }); //end of updateOne
				 }).catch((err)=>{
				 	db.close();
				 	callback("fail");
				 });			 
		 }); //end of findOne
	}); //end of connect
}

exports.getTokenBalanceEach = function(account, tokenCode, callback){
	MongoClient.connect(url, function(err, db) {
		const dbo = db.db("heroku_dg3d93pq");
		const findQuery = {account : account};
		dbo.collection("user").findOne(findQuery, function(err, resFind){
			if(err) throw err;
			eosAccount = resFind.walletAccount;
		
	eos.getTableRows({json : true,
                      code : tokenCode,
                 	scope: eosAccount,
                 	table: "accounts",
                 	}).then((res) => {
		    if(res != undefined && res.rows.length != 0)
     callback(res.rows[0].balance);
    else
     callback(0);
			db.close();
	}).catch((err) => {
                  	callback(0)});
 

		});
	});

}





	
