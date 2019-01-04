const express = require('express');
const deploymentrouter = express.Router();
const DeploymentsController = require('../controllers/deployments')

deploymentrouter.get("/", DeploymentsController.deployments_get_all);

deploymentrouter.get('/:id', DeploymentsController.deployment_get_id)

deploymentrouter.post('/', DeploymentsController.deployment_create_deployment)

deploymentrouter.patch("/:id",DeploymentsController.deployment_patch_deployment);

deploymentrouter.delete("/:id", DeploymentsController.deployment_delete_deployment);

module.exports = deploymentrouter