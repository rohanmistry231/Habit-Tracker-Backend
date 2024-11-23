const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the habit
  description: { type: String },         // Description of the habit
  streak: { type: Number, default: 0 },  // Current streak count
  createdAt: { type: Date, default: Date.now }, // Creation date
});

module.exports = mongoose.model('Habit', habitSchema);