const express = require('express');
const { getVehicles, createVehicle } = require('../controllers/vehicleController');

const router = express.Router();

router.route('/').get(getVehicles).post(createVehicle);

module.exports = router;
