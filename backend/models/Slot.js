const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SlotSchema = new Schema({
  // --- CHANGES START HERE ---
  // We replace dayOfWeek with a specific date
  date: {
    type: Date, // Stores the full date (e.g., 2025-10-26T00:00:00.000Z)
    required: true,
  },
  // --- CHANGES END HERE ---
  
  startTime: {
    type: String, // e.g., "09:00"
    required: true,
  },
  endTime: {
    type: String, // e.g., "11:00"
    required: true,
  },
  maxTrainees: {
    type: Number,
    default: 2,
  },
  
  // Trainee References remain the same
  trainees: [{
    type: Schema.Types.ObjectId,
    ref: 'Trainee'
  }],
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// The 30-day auto-delete index needs to be updated to use the new 'date' field
const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;
SlotSchema.index({ date: 1 }, { expireAfterSeconds: THIRTY_DAYS_IN_SECONDS }); // <-- UPDATED INDEX

module.exports = mongoose.model('Slot', SlotSchema);