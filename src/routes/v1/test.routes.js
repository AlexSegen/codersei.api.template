const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Controller = require("../../controllers/test.controller");

router
  .get("/", auth.isProtected(), auth.checkPermission("task:read"), Controller.getTest);

module.exports = router;
