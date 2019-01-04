const Volume = require('../models/volumes')
const mongoose = require('mongoose');
const Client = require('kubernetes-client').Client
const config = require('kubernetes-client').config
const client = new Client({ config: config.fromKubeconfig(), version: '1.9' })

exports.volumes_get_all = async (req, res) => {
    Volume.find()
        .select("_id apiVersion kind metadata.name spec.accessModes resources.requests.storage")
        .exec()
        .then(docs => {
            const response = {
                volumes: docs.map(doc => {
                    return {
                        _id: doc._id,
                        apiVersion: doc.apiVersion,
                        kind: doc.kind,
                        metadata: doc.metadata,
                        spec: doc.spec,
                        resources: doc.resources
                    }
                })
            }
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json(response);
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

exports.volume_get_id = (req, res) => {
    const id = req.params.id;
    Volume.findById(id)
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

exports.volume_create_volume = (req, res) => {

    const volume = new Volume({
        _id: new mongoose.Types.ObjectId(),
        apiVersion: "v1",
        kind: "PersistentVolumeClaim",
        metadata: {
            name: req.body.name
        },
        spec: {
            accessModes: ["ReadWriteOnce"],
            resources: {
                requests: {
                    storage: "1Gi"
                }
            }
        }
    });
    volume.save()
        .then(async () => {
            const create = await client.api.v1.namespaces('default').persistentvolumeclaim.post({
                body: {
                    apiVersion: "v1",
                    kind: "PersistentVolumeClaim",
                    metadata: {
                        name: req.body.name
                    },
                    spec: {
                        accessModes: ["ReadWriteOnce"],
                        resources: {
                            requests: {
                                storage: "1Gi"
                            }
                        }
                    }
                }
            })
            console.log('Create: ', create)
        })

    res.status(201).json({
        apiVersion: "v1",
        kind: "PersistentVolumeClaim",
        metadata: {
            name: req.body.name
        },
        spec: {
            accessModes: ["ReadWriteOnce"],
            resources: {
                requests: {
                    storage: "1Gi"
                }
            }
        }
    }
    )
}
exports.volume_patch_volume = (req, res) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Volume.update({ _id: id }, { $set: updateOps })
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

exports.volume_delete_volume = (req, res) => {
    const id = req.params.id;
    Volume.remove({ _id: id })
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