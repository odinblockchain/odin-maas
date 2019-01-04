const express = require('express');
const configmaprouter = express.Router();
const ConfigMapController = require('../controllers/configmaps')

configmaprouter.get('/',ConfigMapController.configmaps_get_all);

configmaprouter.post('/',ConfigMapController.configmaps_create_configmap)
    
configmaprouter.get('/:id', ConfigMapController.configmaps_get_id)

configmaprouter.patch('/:id', ConfigMapController.configmaps_patch_configmap)

configmaprouter.delete('/:id', ConfigMapController.configmaps_delete_configmap)

module.exports = configmaprouter