const express = require('express');
const noderouter = express.Router();
const NodeController = require('../controllers/node')
const RpcController = require('../controllers/rpc')
const RpcClient = require('node-json-rpc2').Client;
var dotConf = require("@sim.perelli/dot-conf")
const Nodes = require('../models/nodes')
var odinRpc = "";
var path = './odin_n1.conf'

noderouter.get("/", NodeController.nodes_get_all)

async function rpcclient()
{
    const rpccreds = getrpcconfigs();
    odinRpc = new RpcClient(rpccreds);
}

async function getrpcconfigs(res) {
    const s = await dotConf(path)
    var rpcuser = s('rpcuser')
    var rpcpassword = s('rpcpassword')
    RpcConfig = {
        rpcuser: rpcuser,
        rpcpassword:rpcpassword,
        rpcport: 1988
    }
        res.status(200).json(RpcConfig)
}


noderouter.get("/odin_n1/config", (req, res) => {
    Nodes.find()
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json(docs);
            } else {
                res.status(404).json({
                    message: 'No entries found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
  //  const nodeConfig = {
   //     name: "odin_n1",
    //    nodeip: bind,
   //     nodeprivkey: masternodeprivkey
  //  }

  // odinRpc = new RpcClient(RpcConfig);
    res.status(200).json(nodeConfig)
})
noderouter.get("/odin_n1/status", function (req, res) {
    odinRpc.call({
      method: 'masternode',
      params: ["genkey"]
    }, (err, result) => {
      if (err) {
        res.status(500).json({
          error: err.message
        })
      }
      res.send({ body: result.result })
    })
    
  })

noderouter.post("/", async function(req, res){


    const node = new Nodes({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
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