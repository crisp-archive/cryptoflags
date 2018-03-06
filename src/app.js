// app entry

const express = require('express');
const fs = require('fs');
const path = require('path');
const Web3 = require('web3');

const app = express();

var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const contractData = fs.readFileSync('./build/contracts/FlagFactory.json');
const address = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';
const owner = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';
var flagContract = web3.eth.contract(JSON.parse(contractData).abi)
var flagInstance = flagContract.at(address);

app.get('/coinbase', (req, resp) => {
  web3.eth.getCoinbase(function(err, res) {
    resp.send({ coinbase: res });
  });
});

app.get('/flag/obtain', (req, resp) => {
  flagInstance.createRandomFlag(req.query.name, {from: owner, gas: 2000000, gasPrice: 100000000000}, function(){
    resp.send({ message: 'obtained a flag' });
  });
});

app.get('/my/flags', (req, resp) => {
  let result = flagInstance.getFlagsByOwner(owner);
  resp.send(result);
});

app.get('/flag/get', (req, resp) => {
  let result = flagInstance.getFlag(req.query.id);
  resp.send(result);
});

app.get('/', (req, resp) => {
  resp.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.use('/public', express.static(path.resolve(__dirname, '.', 'public')));

module.exports = app;
