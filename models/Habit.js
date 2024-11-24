const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the habit
  description: { type: String },         // Description of the habit
  streak: { type: Number, default: 0 },  // Current streak count
  is_completed: { type: Boolean, default: false }, // If the habit is completed
  uploads: [
    {
      date: { type: Date, required: true },      // Date of the upload
      imageUrl: { type: String, required: true } // URL of the uploaded image
    }
  ],
  createdAt: { type: Date, default: Date.now } // Creation date
});

module.exports = mongoose.model('Habit', habitSchema);