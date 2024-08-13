const express = require('express');
const { getDrivers, createDriver, assignVehicle, unassignVehicle } = require('../controllers/driverController');
const router = express.Router();

router.route('/').get(getDrivers).post(createDriver);
router.route('/:id/assign').post(assignVehicle);
router.route('/:id/unassign').post(unassignVehicle);

module.exports = router;
