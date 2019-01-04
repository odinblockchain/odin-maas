const Client = require('kubernetes-client').Client
const config = require('kubernetes-client').config
const client = new Client({ config: config.fromKubeconfig(), version: '1.9' })
const ConfigMap = require('../models/configmaps')
const ConfigMapController = require('../controllers/configmaps')
const mongoose = require('mongoose');


const express = require('express');
const configmaprouter = express.Router();

configmaprouter.get('/',ConfigMapController.configmaps_get_all);

configmaprouter.post('/',ConfigMapController.configmaps_create_configmap)
    
configmaprouter.get('/:id', ConfigMapController.configmaps_get_id)

configmaprouter.patch('/:id', ConfigMapController.configmaps_patch_configmap)

configmaprouter.delete('/:id', ConfigMapController.configmaps_delete_configmap)

module.exports = configmaprouter