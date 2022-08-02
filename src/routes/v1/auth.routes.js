const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');
const Controller = require("../../controllers/auth.controller");
const lang = require("../../middleware/localization");

router
  .post("/register", Controller.register)
  .post("/login", lang.localizationMiddleware(), Controller.login)
  .get("/profile", auth.isProtected(), Controller.profile)
  .patch("/profile", auth.isProtected(), Controller.updateProfile);

module.exports = router;
