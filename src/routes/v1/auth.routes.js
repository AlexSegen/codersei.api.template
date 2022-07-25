const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/auth.controller");

router
  .post("/register", Controller.register)
  .post("/login", Controller.login)
  .get("/profile", Controller.profile);

module.exports = router;
