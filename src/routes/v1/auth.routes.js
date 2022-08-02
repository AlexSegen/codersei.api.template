const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');
const Controller = require("../../controllers/auth.controller");
const lang = require("../../middleware/localization");

router
  .post("/register", lang.localizationMiddleware(), Controller.register)
  .post("/login", lang.localizationMiddleware(), Controller.login)
  .get("/profile", lang.localizationMiddleware(), auth.isProtected(), Controller.profile)
  .patch("/profile", lang.localizationMiddleware(), auth.isProtected(), Controller.updateProfile);

module.exports = router;
