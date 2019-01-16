const express = require('express');
const noderouter = express.Router();
const NodeController = require('../controllers/node')
const RpcController = require('../controllers/rpc')
const RpcClient = require('node-json-rpc2').Client;
var dotConf = require("@sim.perelli/dot-conf")
const Nodes = require('../models/nodes')
var path = './odin_n1.conf'
const mongoose = require('mongoose')

noderouter.get("/", NodeController.nodes_get_all)

async function getrpcconfigs(req,res) {
    const s = await dotConf(path)
    var rpcuser = s('rpcuser')
    var rpcpassword = s('rpcpassword')
    RpcConfig = {
        user: rpcuser,
        password:rpcpassword,
        port: 1988
    }
        return RpcConfig
}


noderouter.get("/odin_n1/config", (req, res) => {
    Nodes.find({name: "odin_n1"},function(err,config){
        if (err){
        res.send(err);
    }
    res.status(200).json(config);
    })
    
})
noderouter.get("/odin_n1/status", function (req, res) {
    const rpccreds = getrpcconfigs()
    rpccreds
    .then(
        docs => {
            odinRpc = new RpcClient(docs);
            odinRpc.call({
              method: 'masternode',
              params: ["genkey"]
            }, (err, result) => {
              if (err) {
                res.status(500).json({
                  error: err.message
                })
              }
              res.status(200).json(result.result)})
             //return result.result
            })
            
          })
   // .catch()    
    

   

noderouter.post("/", async function(req, res){
    const node = new Nodes({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        rpcuser: req.body.user,
        rpcpassword: req.body.password,
        nodeip: req.body.nodeip,
        nodeprivkey: req.body.nodeprivkey,
        allocated: false
    })
    node.save()
    .then(async () => {
        res.status(201).json({
            message: node,
        })
      //  var test = j2e({input:"./package.json",output:"./package.conf"})
      
    })
})

module.exports = noderouter