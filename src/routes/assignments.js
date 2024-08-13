const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Driver = require('../models/Driver');

router.post('/', async (req, res) => {
  const { driverId, vehicleId, startTime, endTime } = req.body;

  try {
    // Check if there are any overlapping assignments
    const existingAssignment = await Assignment.findOne({
      driverId: driverId,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } }
      ]
    });

    if (existingAssignment) {
      return res.status(400).json({ error: 'Driver is already assigned to another vehicle during this time.' });
    }

    // Create new assignment
    const assignment = new Assignment({ driverId, vehicleId, startTime, endTime });
    await assignment.save();

    res.status(200).json({ message: 'Driver assigned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
