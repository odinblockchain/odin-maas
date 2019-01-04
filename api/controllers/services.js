const mongoose = require('mongoose')
const Service = require('../models/services')
const Client = require('kubernetes-client').Client
const config = require('kubernetes-client').config
const client = new Client({ config: config.fromKubeconfig(), version: '1.9' })

exports.services_get_all = (req, res) => {
    Service.find()
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

exports.service_get_id = (req, res) => {
    const id = req.params.id;
    Service.findById(id)
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

exports.service_create_service = (req, res) => {
    var serviceBody = {
        apiVersion: "v1",
        kind: "Service",
        metadata: {
            "name": req.body.name,
            "labels": {
                "app": req.body.name
            }
        },
        spec: {
            ports: [
                {
                    "protocol": "TCP",
                    "port": 22100,
                    "targetPort": 22100
                }
            ],
            selector: {
                app: req.body.name
            },
            'typ': 'LoadBalancer' //TODO figure something out here using type
        }
    }
    var stringServiceBody = JSON.stringify(serviceBody)
    var typeFix = stringServiceBody.replace('typ', 'type')
    var typeFixJson = JSON.parse(typeFix)
    const service = new Service({
        _id: new mongoose.Types.ObjectId(),
        apiVersion: typeFixJson.apiVersion,
        kind: typeFixJson.kind,
        metadata: typeFixJson.metadata,
        spec: typeFixJson.spec
    });
    service.save()
        .then(async () => {
            const create = await client.api.v1.namespaces('default').service.post({
                body: typeFixJson

            })
            console.log('Create: ', create)
        })

    res.status(201).json({
        message: "Service Created",

    })
}

exports.service_patch_service = (req, res) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Service.update({ _id: id }, { $set: updateOps })
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

exports.service_delete_service = (req, res) => {
    const id = req.params.id;
    Service.remove({ _id: id })
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