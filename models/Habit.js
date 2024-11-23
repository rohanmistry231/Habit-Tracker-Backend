// models/Habit.js
const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  streak: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  is_completed: {
    type: Boolean,
    default: false, // Habit is not completed initially
  },
});

const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit;
