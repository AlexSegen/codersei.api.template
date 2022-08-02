const express = require("express");
const router = express.Router();

const auth = require('../../middleware/auth');
const parser = require("../../infrastructure/cloudinary");

const Controller = require("../../controllers/auth.controller");

router
  .post("/register", Controller.register)
  .post("/login", Controller.login)
  .get("/profile", auth.isProtected(), Controller.profile)
  .patch("/profile", auth.isProtected(), Controller.updateProfile)
  .patch("/avatar", auth.isProtected(), parser.single("image"), Controller.updateAvatar)
  .post("/request-password-reset", Controller.requestPasswordReset)
  .get("/check-recovery-token/:token", Controller.checkRecoveryToken)
  .post("/reset-password/:token", Controller.resetPassword);

module.exports = router;
