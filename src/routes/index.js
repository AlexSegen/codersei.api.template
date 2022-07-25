const express = require('express');
const router = express.Router();

const v1TaskRouter = require("./v1/task.routes");

router.use("/v1/tasks", v1TaskRouter);

module.exports = router;