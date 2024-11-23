const express = require('express');
const {
  getAllHabits,
  addHabit,
  updateHabit,
  deleteHabit,
} = require('../controllers/habitController'); // Import controller functions

const router = express.Router();

// Route to get all habits
router.get('/', getAllHabits);

// Route to add a new habit
router.post('/', addHabit);

// Route to update a habit by ID
router.put('/:id', updateHabit);

// Route to delete a habit by ID
router.delete('/:id', deleteHabit);

module.exports = router;