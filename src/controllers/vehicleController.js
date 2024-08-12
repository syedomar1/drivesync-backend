const Vehicle = require('../models/Vehicle');

// Get all vehicles
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('assignedDriver');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new vehicle
exports.createVehicle = async (req, res) => {
  const { make, model, licensePlate } = req.body;

  try {
    const vehicle = new Vehicle({ make, model, licensePlate });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
