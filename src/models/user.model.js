const mongoose = require("mongoose");

const roles = ['root', 'admin', 'user'];

var UserSchema = new mongoose.Schema(
  
  {
    identifier: {
      type: String,
      required: true,
      unique: true,
    },
    first_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "https://avatars.dicebear.com/v2/identicon/ninja.svg",
    },
    about: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
      enum: roles,
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      street: {
        type: String,
        default: "",
      },
      suburb: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "",
      },
      zipcode: {
        type: Number
      }
    },
    permissions: {
      type: [String],
      default: []
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);


UserSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}

module.exports = mongoose.model("User", UserSchema);
