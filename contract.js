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


function transfer(from, to, amount, msg){
	myaccount.transfer(from, to, amount + " " + "DAB",msg);
}

exports.sendMessage = function(account, msg){  
  const adMsg = "Please visit https://dabble.cafe";
  var maxLength = 255 - adMsg.length;
  maxLength = maxLength < msg.length ? maxLength : msg.length;
  msg += msg.substring(0, maxLength);
  transfer("awesometeddy","eoscafekorea",0.0001, msg);  
}
