const mongoose = require('mongoose');
const Deployment = require('../models/deployments')
const Client = require('kubernetes-client').Client
const config = require('kubernetes-client').config
const client = new Client({ config: config.fromKubeconfig(), version: '1.9' })


exports.deployments_get_all = (req, res) => {
    Deployment.find()
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
exports.deployment_get_id = (req, res) => {
    const id = req.params.id;
    Deployment.findById(id)
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
exports.deployment_create_deployment = (req, res) => {
    const deployment = new Deployment({
        _id: new mongoose.Types.ObjectId(),
        apiVersion: "apps\/v1",
        kind: "Deployment",
        metadata: {
            name: req.body.name,
            labels: {
                app: req.body.name
            }
        },
        spec: {
            replicas: 1,
            selector: {
                matchLabels: {
                    app: req.body.name
                }
            },
            template: {
                metadata: {
                    labels: {
                        app: req.body.name
                    }
                },

                spec: {
                    containers: [{
                        name: req.body.name,
                        image: "registry.hub.docker.com\/bohica\/odin:latest",
                        command: [
                            "\/bin\/bash",
                            "-c",
                            "cp -r \/root\/odin_data_sync\/ \/root\/odin_data\/ && sleep 60 && odind -datadir=\/root\/odin_data -conf=\/root\/.odin\/odin.conf && tail -f \/dev\/null"
                        ],
                        ports: [{
                            containerPort: 22100
                        }
                        ],
                        volumeMounts: [
                            {
                                mountPath: "\/root\/.odin",
                                name: "config"
                            },
                            {
                                name: req.body.name,
                                mountPath: "\/root\/odin_data_sync"
                            }
                        ]
                    }
                    ],
                    volumes: [{
                        name: "config",
                        configMap: {
                            name: req.body.name,
                            items: [
                                {
                                    key: "odin.conf",
                                    path: "odin.conf"
                                }
                            ]
                        }
                    },
                    {
                        name: req.body.name,
                        persistentVolumeClaim: {
                            claimName: req.body.name
                        }
                    }
                    ]
                }

            }
        }
    }

    );
    deployment.save()

        .then(async result => {

            const create = await client.apis.apps.v1.namespaces('default').deployments.post({
                body: {
                    apiVersion: deployment.apiVersion,
                    kind: deployment.kind,
                    metadata: deployment.metadata,
                    spec: deployment.spec
                }
            })

            console.log(create)
            console.log(result);
            res.status(201).json({
                message: "Handling POST requests to /deployments",
                createdDeployment: result
            })
        })
}
exports.deployment_patch_deployment = (req, res) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) { // How to use: [{propName: metadata.name,value: "Whatever"}]
        updateOps[ops.propName] = ops.value;
    }
    Deployment.update({ _id: id }, { $set: updateOps })
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
exports.deployment_delete_deployment = (req, res) => {
    const id = req.params.id;
    Deployment.remove({ _id: id })
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