const express = require("express");
const router = express.Router();

const auth = require('../../middleware/auth');
const parser = require("../../infrastructure/cloudinary");

const Controller = require("../../controllers/auth.controller");

router
  .post("/register", Controller.register)
  .post("/login", Controller.login)
  .get("/me", auth.isProtected(), Controller.profile)
  .patch("/me", auth.isProtected(), Controller.updateProfile)
  .patch("/me/avatar", auth.isProtected(), parser.single("image"), Controller.updateAvatar)
  .patch("/me/password", auth.isProtected(), Controller.updatePassword)
  .post("/request-password-reset", Controller.requestPasswordReset)
  .get("/check-recovery-token/:token", Controller.checkRecoveryToken)
  .post("/reset-password/:token", Controller.resetPassword);

module.exports = router;
