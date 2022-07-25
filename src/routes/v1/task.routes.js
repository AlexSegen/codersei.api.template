const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/task.controller");

router
  .get("/", Controller.getAll)
  .get("/:id", Controller.getOne)
  .post("/", Controller.create)
  .patch("/:id", Controller.update)
  .delete("/:id", Controller.remove);

module.exports = router;
