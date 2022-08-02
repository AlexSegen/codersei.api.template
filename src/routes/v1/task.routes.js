const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Controller = require("../../controllers/task.controller");
const lang = require("../../middleware/localization");

router
  .get("/", lang.localizationMiddleware(), Controller.getAll)
  .get("/:id", lang.localizationMiddleware(), Controller.getOne)
  .post("/", lang.localizationMiddleware(), auth.isProtected(), Controller.create)
  .patch("/:id", lang.localizationMiddleware(), auth.isProtected(), Controller.update)
  .delete("/:id", lang.localizationMiddleware(), auth.isProtected("admin"), Controller.remove);

module.exports = router;
