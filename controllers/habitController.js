const Habit = require('../models/Habit');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Set up multer storage with dynamic folder creation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const habitId = req.params.id; // Get habit ID from request params
    const uploadDir = path.join(__dirname, '..', 'uploads', habitId);

    // Create folder if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir); // Set destination to the habit-specific folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage }); // Initialize multer

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

const addDailyUpload = async (req, res) => {
  const { id } = req.params; // Habit ID

  upload.single('photo')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to upload image', error: err.message });
    }

    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = `/uploads/${id}/${file.filename}`; // Path to the uploaded image

    try {
      const habit = await Habit.findById(id);

      if (!habit) {
        return res.status(404).json({ message: 'Habit not found' });
      }

      // Get today's date
      const today = new Date().toDateString();
      const todayDate = new Date();

      const lastUpload = habit.uploads.length > 0 ? habit.uploads[habit.uploads.length - 1]?.date?.toDateString() : null;

      if (lastUpload !== today) {
        // Add new upload with today's date
        habit.uploads.push({ date: todayDate, imageUrl });

        // Maintain streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastUpload === yesterday.toDateString()) {
          habit.streak += 1; // Increment streak
        } else {
          habit.streak = 1; // Reset streak if the previous upload was not yesterday
        }

        // Mark habit as completed
        habit.is_completed = true;
      } else {
        return res.status(400).json({ message: 'Upload for today already exists' });
      }

      const updatedHabit = await habit.save();
      res.status(200).json(updatedHabit);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add daily upload', error: error.message });
    }
  });
};

// DELETE request to delete today's upload
const deleteDailyUpload = async (req, res) => {
  const { id } = req.params; // Habit ID
  
  try {
    const habit = await Habit.findById(id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Get today's date
    const today = new Date().toDateString();

    // Find the index of today's upload
    const todayUploadIndex = habit.uploads.findIndex(upload => upload.date.toDateString() === today);

    if (todayUploadIndex === -1) {
      return res.status(400).json({ message: 'No upload found for today' });
    }

    // Remove the upload from the uploads array
    habit.uploads.splice(todayUploadIndex, 1);
    
    // Reset streak if image is deleted
    habit.streak = Math.max(habit.streak - 1, 0);

    // Optionally mark habit as not completed
    habit.is_completed = false; 

    const updatedHabit = await habit.save();
    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete daily upload', error: error.message });
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
  addDailyUpload,
  deleteDailyUpload
};