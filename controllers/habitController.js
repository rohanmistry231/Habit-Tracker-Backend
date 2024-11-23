// controllers/habitController.js
const Habit = require('../models/Habit');

// Function to get all habits
const getAllHabits = async (req, res) => {
  try {
    const habits = await Habit.find();
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch habits' });
  }
};

// Function to add a new habit
const addHabit = async (req, res) => {
  const { name, description } = req.body;
  const newHabit = new Habit({
    name,
    description,
  });

  try {
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create habit' });
  }
};

// Function to update a habit (including marking it as completed)
const updateHabit = async (req, res) => {
  const { habitId } = req.params;
  const { name, description, streak, is_completed } = req.body;

  try {
    const updatedHabit = await Habit.findByIdAndUpdate(
      habitId,
      { name, description, streak, is_completed },
      { new: true }
    );
    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update habit' });
  }
};

// Function to delete a habit
const deleteHabit = async (req, res) => {
  const { habitId } = req.params;

  try {
    await Habit.findByIdAndDelete(habitId);
    res.status(200).json({ message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete habit' });
  }
};

// Function to mark habit as completed
const markHabitCompleted = async (req, res) => {
  const { habitId } = req.params;

  try {
    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Toggle the is_completed field
    habit.is_completed = !habit.is_completed;
    if (habit.is_completed) {
      habit.streak += 1; // Increase streak if habit is marked as completed
    }

    await habit.save();
    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark habit as completed' });
  }
};

module.exports = { getAllHabits, addHabit, updateHabit, deleteHabit, markHabitCompleted };