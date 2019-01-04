const express = require('express');
const servicerouter = express.Router();
const ServicesController = require('../controllers/services')

servicerouter.get("/", ServicesController.services_get_all);

servicerouter.get('/:id', ServicesController.service_get_id)

servicerouter.post('/', ServicesController.service_create_service)

servicerouter.patch("/:id", ServicesController.service_patch_service);

servicerouter.delete("/:id", ServicesController.service_delete_service);

module.exports = servicerouter