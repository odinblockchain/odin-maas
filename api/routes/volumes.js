const express = require('express');
const volumerouter = express.Router();
const VolumesController = require('../controllers/volumes')

volumerouter.get("/", VolumesController.volumes_get_all);

volumerouter.get('/:id',VolumesController.volume_get_id);

volumerouter.post('/', VolumesController.volume_create_volume)

volumerouter.patch("/:id",VolumesController.volume_patch_volume);

volumerouter.delete("/:id", VolumesController.volume_delete_volume);

module.exports = volumerouter