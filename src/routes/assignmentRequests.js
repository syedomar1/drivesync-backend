const express = require('express');
const mongoose = require('mongoose');
const AssignmentRequest = require('../models/AssignmentRequest');
const Assignment = require('../models/Assignment');
const Driver = require('../models/Driver');

const router = express.Router();

// Send assignment requests to multiple drivers
router.post('/send', async (req, res) => {
  try {
    const { assignmentId, driverIds } = req.body;

    const assignmentRequests = await Promise.all(
      driverIds.map(driverId => {
        return AssignmentRequest.create({
          assignment: assignmentId,
          driver: driverId,
        });
      })
    );

    res.status(200).json({ message: 'Assignment requests sent', assignmentRequests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send assignment requests' });
  }
});

// Use mongoose.isValidObjectId to validate ObjectIDs
const isValidObjectId = mongoose.isValidObjectId;

router.post('/request', async (req, res) => {
  try {
    const { driverIds, vehicleId, startTime, endTime } = req.body;

    // Validate input
    if (
      !Array.isArray(driverIds) ||
      !driverIds.length ||
      !isValidObjectId(vehicleId) ||
      isNaN(new Date(startTime)) ||
      isNaN(new Date(endTime))
    ) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Validate IDs
    if (!driverIds.every(id => isValidObjectId(id))) {
      return res.status(400).json({ error: 'Invalid driver ID(s)' });
    }

    // Prepare assignment requests
    const assignmentRequests = driverIds.map(driverId => ({
      driver: driverId,  // Corrected: use 'driver' instead of 'driverId'
      vehicle: vehicleId, // Corrected: use 'vehicle' instead of 'vehicleId' (if required in your schema)
      startTime,
      endTime,
      status: 'pending'
    }));

    // Save to database
    const newAssignments = await Assignment.insertMany(assignmentRequests);

    res.status(201).json(newAssignments);
  } catch (error) {
    console.error('Error details:', error); // Log the detailed error
    res.status(500).json({ error: 'Failed to create assignment request', details: error.message });
  }
});

// Accept or reject an assignment request
router.post('/respond', async (req, res) => {
  try {
    const { requestId, response } = req.body;

    const assignmentRequest = await AssignmentRequest.findById(requestId).populate('assignment');
    if (!assignmentRequest) {
      return res.status(404).json({ error: 'Assignment request not found' });
    }

    if (assignmentRequest.status !== 'pending') {
      return res.status(400).json({ error: 'Assignment request is no longer valid' });
    }

    if (response === 'accepted') {
      assignmentRequest.status = 'accepted';
      assignmentRequest.assignment.status = 'accepted';
      assignmentRequest.assignment.driver = assignmentRequest.driver;

      // Invalidate all other requests for the same assignment
      await AssignmentRequest.updateMany(
        { assignment: assignmentRequest.assignment._id, status: 'pending' },
        { status: 'rejected' }
      );

      await assignmentRequest.assignment.save();
    } else {
      assignmentRequest.status = 'rejected';
    }

    await assignmentRequest.save();

    res.status(200).json({ message: 'Response recorded', assignmentRequest });
  } catch (error) {
    res.status(500).json({ error: 'Failed to respond to assignment request' });
  }
});

// Fetch pending assignment requests for a driver
router.get('/driver/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;

    // Validate driverId
    if (!driverId || !mongoose.isValidObjectId(driverId)) {
      return res.status(400).json({ error: 'Invalid or missing driver ID' });
    }

    const requests = await AssignmentRequest.find({ driver: driverId, status: 'pending' })
      .populate('assignment')
      .populate('driver');

    if (!requests.length) {
      return res.status(404).json({ message: 'No pending requests found' });
    }

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignment requests' });
  }
});

module.exports = router;
