var Web3 = require("web3");
var request = require("request");
console.log(Web3.version);
var web3 = new Web3(
  "https://mainnet.infura.io/v3/6cd7ac875a424afc8c9dd61140b630f1"
);
var abi = require("./rnt.json");
var address = "0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b";
var myContract = new web3.eth.Contract(abi, address); //合约实例
//查询合约名称
myContract.methods
  .name()
  .call()
  .then(function(result) {
    console.log("result____________", result);
  });

//查询某一地址交易记录;
myContract.getPastEvents(
  "OrdersMatched",
  {
    filter: { id: "log_ec17f05e" },
    fromBlock: 11688126,
    toBlock: "latest",
  },
  (error, events) => {
    console.log("event1_________", events);
  }
);

//打印合约接口
// console.log("abi_interface____________", myContract.options.jsonInterface);

// //查询某一事件的日志
// myContract.events.OwnershipTransferred(
//   // {
//   //   // filter: { _from: "0xd8079b7e359e0237b4e687edc323161063c59405" },
//   //   fromBlock: 11688128,
//   //   // toBlock: 11688129,
//   // },
//   {},
//   function(error, event) {
//     console.log("event2_________", event);
//   }
// );

// var events = myContract.events.OrdersMatched(
//   {
//     fromBlock: 0,
//     toBlock: "latest",
//   },
//   (error, events) => {
//     console.log("event2_________", events);
//   }
// );
