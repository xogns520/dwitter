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

exports.sendDab = function(account, amount){
	//transfer DAB to real EOS account
	//success : reset wallet count to zero
	//fail : do nothing and show fail popup
	;
}

exports.getTokenBalanceEach = async function(account, tokenCode){
	let bal = await eos.getTableRows({json : true,
                      code : tokenCode,
                 	scope: account,
                 	table: "accounts",
                 	}).catch((err) => {
                  	return null});
 
    if(bal != undefined && bal.rows.length != 0)
     return bal.rows[0].balance;
    else
     return null;

}
	
