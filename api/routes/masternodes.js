const express = require('express');
const masternoderouter = express.Router();
const MasternodeController = require('../controllers/masternodes')

masternoderouter.get("/", MasternodeController.masternodes_get_all);

module.exports = masternoderouter