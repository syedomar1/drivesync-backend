const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const Assignment = require('../models/Assignment');

router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Populate driver assignments
    const assignments = await Assignment.find({ driverId: driver._id }).populate('vehicleId');

    res.status(200).json({ ...driver.toObject(), assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
