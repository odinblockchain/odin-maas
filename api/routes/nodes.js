const express = require('express');
const noderouter = express.Router();
const NodeController = require('../controllers/node')
const RpcController = require('../controllers/rpc')
var dotConf = require("@sim.perelli/dot-conf")
const Nodes = require('../models/nodes')
const mongoose = require('mongoose')

noderouter.get("/", NodeController.nodes_get_all)

noderouter.get("/odin_n1", (req, res) => {
    Nodes.find({ name: "odin_n1" }, function (err, config) {
        if (err) {
            res.send(err);
        }
        res.status(200).json(config);
    })

})

async function getconfigs(path) {
    const s = await dotConf(path)
    var user = s('rpcuser')
    var password = s('rpcpassword')
    var bind = s('bind')
    var masternodeprivkey = s('masternodeprivkey')
    const nodeConfig = {
        user: user,
        password: password,
        port: 1988,
        bind: bind,
        masternodeprivkey: masternodeprivkey
    }
    return nodeConfig
}

noderouter.post("/odin_n1/status", RpcController.getMasternodeStatus)

//requires name and config path
noderouter.post("/", async function (req, res) {

    getconfigs(req.body.configpath)
        .then(docs => {

            const node = new Nodes({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                rpcuser: docs.user,
                rpcpassword: docs.password,
                nodeip: docs.bind,
                nodeprivkey: docs.masternodeprivkey,
                configpath: req.body.configpath,
                allocated: false
            })

            node.save()
                .then(async () => {
                    res.status(201).json({
                        message: node,
                    })


                })
        })

})

module.exports = noderouter