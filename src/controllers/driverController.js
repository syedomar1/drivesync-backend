const mongoose = require('mongoose');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

// Get all drivers
exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate('assignedVehicle');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new driver
exports.createDriver = async (req, res) => {
  const { name, email, phone, location, shift} = req.body;
  console.log(req.body);
  try {
    // Check if userId is valid
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //   return res.status(400).json({ message: 'Invalid userId format' });
    // }

    // Create and save the driver
    const driver = new Driver({ name, email, phone, location, shift});
    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Assign a vehicle to a driver
exports.assignVehicle = async (req, res) => {
  const { id } = req.params;
  const { vehicleId } = req.body;

  try {
    // Check if driver and vehicle exist
    const driver = await Driver.findById(id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // Assign vehicle to driver and vice versa
    driver.assignedVehicle = vehicleId;
    await driver.save();

    vehicle.assignedDriver = id;
    await vehicle.save();

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unassign a vehicle from a driver
exports.unassignVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if driver exists
    const driver = await Driver.findById(id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    const vehicleId = driver.assignedVehicle;

    // Unassign vehicle from driver and vice versa
    driver.assignedVehicle = null;
    await driver.save();

    if (vehicleId) {
      const vehicle = await Vehicle.findById(vehicleId);
      if (vehicle) {
        vehicle.assignedDriver = null;
        await vehicle.save();
      }
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
