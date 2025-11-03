const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TraineeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true, // Good to prevent duplicate trainees
  },
  email: {
    type: String,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Trainee', TraineeSchema);