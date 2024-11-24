const express = require("express");
const router = express.Router();
const habitController = require("../controllers/habitController");

// Route to get all habits
router.get("/", habitController.getAllHabits);

// Route to add a new habit
router.post("/", habitController.addHabit);

// Route to update an existing habit
router.patch("/:id", habitController.updateHabit);

// Route to add a daily upload and maintain streak
router.post("/:id/upload", habitController.addDailyUpload);

// Route to delete today's daily upload and update streak
router.delete("/:id/upload", habitController.deleteDailyUpload);

// Route to delete a habit
router.delete("/:id", habitController.deleteHabit);

module.exports = router;