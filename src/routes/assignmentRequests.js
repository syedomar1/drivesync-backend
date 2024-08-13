// routes/assignmentRequests.js
const express = require('express');
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
      assignmentRequest.assignment.driverId = assignmentRequest.driver;

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
    const requests = await AssignmentRequest.find({ driver: driverId, status: 'pending' })
      .populate('assignment')
      .populate('driver');

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignment requests' });
  }
});

module.exports = router;
