const express = require('express');
const { getVehicles, createVehicle } = require('../controllers/vehicleController');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

const router = express.Router();

// Route to get all vehicles and create a new vehicle
router.route('/').get(getVehicles).post(createVehicle);

// Route to assign a driver to a vehicle
router.post('/:vehicleId/assign', async (req, res) => {
  const { vehicleId } = req.params;
  const { driverId } = req.body;

  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const driver = await Driver.findById(driverId);
    if (!driver || !driver.available) {
      return res.status(404).json({ message: 'Driver not found or not available' });
    }

    vehicle.assignedDriver = driverId;
    await vehicle.save();

    driver.available = false;
    await driver.save();

    res.json({ message: 'Driver assigned to vehicle', vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning driver', error });
  }
});

// Route to unassign a driver from a vehicle
router.post('/:vehicleId/unassign', async (req, res) => {
  const { vehicleId } = req.params;

  try {
    const vehicle = await Vehicle.findById(vehicleId).populate('assignedDriver');
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (!vehicle.assignedDriver) {
      return res.status(400).json({ message: 'No driver assigned to this vehicle' });
    }

    const driverId = vehicle.assignedDriver._id;
    vehicle.assignedDriver = null;
    await vehicle.save();

    const driver = await Driver.findById(driverId);
    driver.available = true;
    await driver.save();

    res.json({ message: 'Driver unassigned from vehicle', vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Error unassigning driver', error });
  }
});

module.exports = router;
