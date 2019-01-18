const mongoose = require('mongoose')
const Nodes = require('../models/nodes')
const express = require('express');
const rpcrouter = express.Router();
const RpcController = require('../controllers/rpc')

exports.nodes_get_all = (req, res) => {
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
}

exports.nodes_create_node = (req, res) => {

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
}