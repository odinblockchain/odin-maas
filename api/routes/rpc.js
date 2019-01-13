const express = require('express');
const rpcrouter = express.Router();
const RpcController = require('../controllers/rpc')

rpcrouter.get("/getinfo",RpcController.getInfo)

rpcrouter.get("/masternodestatus",RpcController.getMasternodeStatus)

rpcrouter.get("/masternodelist",RpcController.getMasternodeList)

module.exports = rpcrouter