const express = require('express');
const router = express.Router();

const v1WorkoutRouter = require("./v1/workout.routes");
router.use("/v1/workouts", v1WorkoutRouter);

module.exports = router;