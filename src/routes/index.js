const express = require('express');
const router = express.Router();

const TaskRouterV1 = require("./v1/task.routes");
const AuthRouterV1 = require("./v1/auth.routes");

router.use("/v1/tasks", TaskRouterV1);
router.use("/v1/auth", AuthRouterV1);

module.exports = router;