const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const utils = require("utility");
const fs = require("fs");
const jwt = require("jsonwebtoken");

//const Image = require("../models/image.model");
const auth = require("../middleware/auth");
//const useSendgrid = require("../services/sendgrid");

const User = require("../models/user.model");
const tokenService = require("../services/token.service");
const config = require("../config");

const { serviceResult } = require("../helpers/serviceResult");
const ResponseError = require("../helpers/responseError");

const register = async (user) => {
  try {
    const exists = await User.findOne({ email: user.email });

    if (exists) return serviceResult(400, null, "User already exists");

    user.password = bcrypt.hashSync(user.password, 10);
    user.avatar = `https://gravatar.com/avatar/${utils.md5(user.email)}`;

    const record = await User.create(user);

    const tokens = tokenService.issueToken(record);

    return serviceResult(
      201,
      {
        user: record,
        ...tokens,
      },
      "User created"
    );
  } catch (error) {
    throw error;
  }
};

const login = async (user) => {
  try {
    const { email, password } = user;

    let exists = await User.findOne({ email })
    
    if (!exists)
      return serviceResult(404,null,"User not found");
    
    // auth.checkStatus(user.status);
    
    const isMatch = await bcrypt.compare(password, exists.password);
    if (!isMatch)
      return serviceResult(401,null,"Invalid user or password");

    const tokens = tokenService.issueToken(exists);

    console.log(tokens);	

    return serviceResult(200,{
      user: exists,
      ...tokens,
    },"Login successful");

  } catch (error) {
    throw error;
  }
}

const getProfile = async (authorizationHeader) => {
  try {

    if (!authorizationHeader)
      throw new ResponseError({
        name: "AuthenticationError",
        message: "Not Authorized: Token not found",
        statusCode: 401,
      });

    const token = authorizationHeader.replace("Bearer ", "");
    
    const decoded = tokenService.verifyToken(token);

    const user = await User.findById(decoded._id);

    if (!user)
      throw new ResponseError({
        name: "AuthenticationError",
        message: "Not Authorized",
        statusCode: 401,
      });


    // auth.checkStatus(user.status);

    return serviceResult(200,user, "Full user profile");;

  } catch (error) {
    throw error;
  }
}

module.exports = {
  register,
  login,
  getProfile
};
