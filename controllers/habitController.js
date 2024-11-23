const Habit = require('../models/Habit'); // Import the Habit model

// Get All Habits
const getAllHabits = async (req, res) => {
  try {
    const habits = await Habit.find();
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch habits', error: error.message });
  }
};

// Add a New Habit
const addHabit = async (req, res) => {
  const { name, description } = req.body;

  // Validate required fields
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const newHabit = new Habit({
      name,
      description,
    });

    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add habit', error: error.message });
  }
};

// Update a Habit
const updateHabit = async (req, res) => {
  const { id } = req.params;
  const { name, description, streak } = req.body;

  try {
    const updatedHabit = await Habit.findByIdAndUpdate(
      id,
      { name, description, streak },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedHabit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update habit', error: error.message });
  }
};

// Delete a Habit
const deleteHabit = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedHabit = await Habit.findByIdAndDelete(id);

    if (!deletedHabit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.status(200).json({ message: 'Habit deleted successfully', habit: deletedHabit });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete habit', error: error.message });
  }
};

module.exports = {
  getAllHabits,
  addHabit,
  updateHabit,
  deleteHabit,
};