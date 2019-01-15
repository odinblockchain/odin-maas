const express = require('express');
const noderouter = express.Router();
const NodeController = require('../controllers/node')
const RpcController = require('../controllers/rpc')
const RpcClient = require('node-json-rpc2').Client;
var dotConf = require("@sim.perelli/dot-conf")
var odinRpc = "";

noderouter.get("/", NodeController.nodes_get_all)

noderouter.get("/odin_n1", async function getconfigs(req, res) {
    path = './odin_n1.conf'
    const s = await dotConf(path)
    var user = s('rpcuser')
    var password = s('rpcpassword')
    var ip = s('bind')
    var masternodeprivatekey = s('masternodeprivkey')

    const RpcConfig = {
        user: user,
        password: password,
        port: 1988
    }
    const nodeConfig = {
        name: "odin_n1",
        nodeip: ip,
        nodeprivkey: masternodeprivatekey
    }

    odinRpc = new RpcClient(RpcConfig);
    res.status(200).json(nodeConfig)
})

noderouter.post("/", (req, res) => {

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