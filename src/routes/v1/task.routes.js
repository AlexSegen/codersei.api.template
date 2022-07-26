const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Controller = require("../../controllers/task.controller");

router
  .get("/", Controller.getAll)
  .get("/:id", Controller.getOne)
  .post("/", auth.isProtected(), Controller.create)
  .patch("/:id", auth.isProtected(), Controller.update)
  .delete("/:id", auth.isProtected(), Controller.remove);

module.exports = router;
