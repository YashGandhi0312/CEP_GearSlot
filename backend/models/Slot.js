const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SlotSchema = new Schema({
  dayOfWeek: {
    type: Number, // 0 = Sunday, 1 = Monday, etc.
    required: true,
  },
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

  // This tells Mongoose that 'trainees' will be an array of
  // IDs that point to documents in the 'Trainee' collection.
  trainees: [{
    type: Schema.Types.ObjectId,
    ref: 'Trainee'
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// This creates the 30-day auto-delete "Time-To-Live" index
const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;
SlotSchema.index({ createdAt: 1 }, { expireAfterSeconds: THIRTY_DAYS_IN_SECONDS });


module.exports = mongoose.model('Slot', SlotSchema);