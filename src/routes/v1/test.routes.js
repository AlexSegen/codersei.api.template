const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const parser = require("../../infrastructure/cloudinary");

const Controller = require("../../controllers/test.controller");

router
  .get("/", auth.isProtected(), parser.single("image"), Controller.getTest);

module.exports = router;
