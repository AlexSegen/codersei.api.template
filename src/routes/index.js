const express = require('express');
const router = express.Router();

const TestRouterV1 = require("./v1/test.routes");
const TaskRouterV1 = require("./v1/task.routes");
const AuthRouterV1 = require("./v1/auth.routes");


router.use("/v1/test", TestRouterV1);
router.use("/v1/tasks", TaskRouterV1);
router.use("/v1/auth", AuthRouterV1);

module.exports = router;