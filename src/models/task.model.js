const mongoose = require("mongoose");
const modelName = "Task";
const modelSchema = new mongoose.Schema(
  {
    identifier: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(modelName, modelSchema);
