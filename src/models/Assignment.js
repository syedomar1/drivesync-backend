const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
}, { timestamps: true });

AssignmentSchema.index({ driverId: 1, startTime: 1, endTime: 1 }, { unique: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);
