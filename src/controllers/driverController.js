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
  const { name, email, phone, location, shift } = req.body;

  try {
    const driver = new Driver({ name, email, phone, location, shift });
    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Assign a vehicle to a driver
exports.assignVehicle = async (req, res) => {
  const { id } = req.params;
  const { vehicleId } = req.body;

  try {
    const driver = await Driver.findById(id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    driver.assignedVehicle = vehicleId;
    await driver.save();

    const vehicle = await Vehicle.findById(vehicleId);
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
    const driver = await Driver.findById(id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    const vehicleId = driver.assignedVehicle;
    driver.assignedVehicle = null;
    await driver.save();

    const vehicle = await Vehicle.findById(vehicleId);
    vehicle.assignedDriver = null;
    await vehicle.save();

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
