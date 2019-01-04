const mongoose = require('mongoose')
const ConfigMap = require('../models/configmaps')
const Client = require('kubernetes-client').Client
const config = require('kubernetes-client').config
const client = new Client({ config: config.fromKubeconfig(), version: '1.9' })

exports.configmaps_get_all =  (req, res) => {
    ConfigMap.find()
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

exports.configmaps_get_id = (req,res) => {
    const id = req.params.id;
    ConfigMap.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.configmaps_create_configmap =  async (req, res) => {
    const configmap = new ConfigMap({
        _id: new mongoose.Types.ObjectId(),
        kind: "ConfigMap",
        apiVersion: "v1",
        metadata: {
            name: req.body.name
        },
        data: {
            "odin.conf": req.body.config //use the "config" attribute to insert the config file contents.
        }

    });
    configmap.save()
    .then(async () => {

       const create = await client.api.v1.namespaces('default').configmap.post(
           {
               body: {
                apiVersion: configmap.apiVersion,
                kind: configmap.kind,
                metadata: configmap.metadata,
                data: {
                 "odin.conf" : configmap.data.odin.conf
                }
            }
        })
        console.log('Create: ', create)
    })
}

exports.configmaps_patch_configmap = (req,res) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    ConfigMap.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.configmaps_delete_configmap = (req,res) => {
    const id = req.params.id;
    ConfigMap.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}