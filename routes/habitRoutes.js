// routes/habitRoute.js
const express = require('express');
const router = express.Router();
const {
  getAllHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  markHabitCompleted,
} = require('../controllers/habitController');

// Routes for habits
router.get('/habits', getAllHabits); // Get all habits
router.post('/habits', addHabit); // Add new habit
router.put('/habits/:habitId', updateHabit); // Update habit details
router.delete('/habits/:habitId', deleteHabit); // Delete habit
router.patch('/habits/:habitId/complete', markHabitCompleted); // Mark habit as completed

module.exports = router;