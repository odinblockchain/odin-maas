const Client = require('kubernetes-client').Client
const config = require('kubernetes-client').config
const client = new Client({ config: config.fromKubeconfig(), version: '1.9' })
const ConfigMap = require('../models/configmaps')
const mongoose = require('mongoose');


const express = require('express');
const configmaprouter = express.Router();

configmaprouter.get('/', (req, res) => {
    res.status(200).json({
        message: 'Handling GET requests to /configmaps'
    })
});

configmaprouter.post('/', async (req, res) => {
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
            //console.log('Create: ', create)
        })
        console.log('Create: ', create)
    })
})
    



configmaprouter.get('/:id', (req) => {

})

configmaprouter.patch('/:id', (req) => {

})

configmaprouter.delete('/:id', (req) => {

})

module.exports = configmaprouter