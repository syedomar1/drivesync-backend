const express = require('express');
const { getDrivers, createDriver, assignVehicle, unassignVehicle,searchDriversByProximity } = require('../controllers/driverController');
const router = express.Router();

router.route('/').get(getDrivers).post(createDriver);
router.route('/:id/assign').post(assignVehicle);
router.route('/:id/unassign').post(unassignVehicle);
router.post('/search', searchDriversByProximity);
module.exports = router;
