const Habit = require("../models/Habit");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Set up multer to use /tmp for temporary storage
const upload = multer({
  dest: "/tmp", // Temporary directory for file storage
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

// Get All Habits
const getAllHabits = async (req, res) => {
  try {
    const habits = await Habit.find();
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch habits", error: error.message });
  }
};

// Add a New Habit
const addHabit = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const newHabit = new Habit({ name, description });
    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    res.status(500).json({ message: "Failed to add habit", error: error.message });
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
      { new: true, runValidators: true }
    );

    if (!updatedHabit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: "Failed to update habit", error: error.message });
  }
};

// Add Daily Upload
const addDailyUpload = async (req, res) => {
  const { id } = req.params;

  upload.single("photo")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to upload image", error: err.message });
    }

    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    try {
      const habit = await Habit.findById(id);

      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }

      // Get today's date
      const today = new Date().toDateString();
      const todayDate = new Date();

      const lastUpload = habit.uploads.length > 0
        ? habit.uploads[habit.uploads.length - 1]?.date?.toDateString()
        : null;

      if (lastUpload !== today) {
        // Save image path temporarily and push upload record
        const tempImageUrl = `/tmp/${file.filename}`;
        habit.uploads.push({ date: todayDate, imageUrl: tempImageUrl });

        // Maintain streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastUpload === yesterday.toDateString()) {
          habit.streak += 1;
        } else {
          habit.streak = 1;
        }

        habit.is_completed = true;
      } else {
        return res.status(400).json({ message: "Upload for today already exists" });
      }

      const updatedHabit = await habit.save();
      res.status(200).json(updatedHabit);
    } catch (error) {
      res.status(500).json({ message: "Failed to add daily upload", error: error.message });
    }
  });
};

// Delete Today's Upload
const deleteDailyUpload = async (req, res) => {
  const { id } = req.params;

  try {
    const habit = await Habit.findById(id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date().toDateString();
    const todayUploadIndex = habit.uploads.findIndex(
      (upload) => upload.date.toDateString() === today
    );

    if (todayUploadIndex === -1) {
      return res.status(400).json({ message: "No upload found for today" });
    }

    habit.uploads.splice(todayUploadIndex, 1);
    habit.streak = Math.max(habit.streak - 1, 0);
    habit.is_completed = false;

    const updatedHabit = await habit.save();
    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete daily upload", error: error.message });
  }
};

// Delete a Habit
const deleteHabit = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedHabit = await Habit.findByIdAndDelete(id);

    if (!deletedHabit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json({ message: "Habit deleted successfully", habit: deletedHabit });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete habit", error: error.message });
  }
};

module.exports = {
  getAllHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  addDailyUpload,
  deleteDailyUpload,
};