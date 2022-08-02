const bcrypt = require("bcryptjs");
const utils = require("utility");
const { v4: uuid } = require("uuid");

const User = require("../models/user.model");
const auth = require("../middleware/auth");	
const tokenService = require("../services/token.service");
const ResponseError = require("../helpers/responseError");
const { serviceResult } = require("../helpers/serviceResult");

const register = async (user) => {
  try {
    const exists = await User.findOne({ email: user.email });

    if (exists) return serviceResult(400, null, "auth.register.conflict");

    user.password = bcrypt.hashSync(user.password, 10);
    user.avatar = `https://gravatar.com/avatar/${utils.md5(user.email)}`;

    user.identifier = uuid();

    const record = await User.create(user);

    const tokens = tokenService.issueToken(record);

    return serviceResult(
      201,
      {
        user: record,
        ...tokens,
      },
      "auth.register.success"
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
      return serviceResult(404,null,"auth.login.not_found");
    
    auth.checkStatus(exists.status);
    
    const isMatch = await bcrypt.compare(password, exists.password);
    if (!isMatch)
      return serviceResult(401,null,"auth.login.fail");

    const tokens = tokenService.issueToken(exists);

    return serviceResult(200,{
      user: exists,
      ...tokens,
    },"auth.login.success");

  } catch (error) {
    throw error;
  }
}

const getProfile = async (authorizationHeader) => {
  try {

    if (!authorizationHeader)
      throw new ResponseError({
        name: "AuthenticationError",
        message: "auth.profile.token_not_found",
        statusCode: 401,
      });

    const token = authorizationHeader.replace("Bearer ", "");
    
    const decoded = tokenService.verifyToken(token);

    const user = await User.findById(decoded._id);

    if (!user)
      throw new ResponseError({
        name: "AuthenticationError",
        message: "auth.profile.forbidden",
        statusCode: 401,
      });

    return serviceResult(200,user, "auth.profile.user_profile");

  } catch (error) {
    throw error;
  }
}

const updateProfile = async (id, payload) => {
  try {

    const record = await User.findByIdAndUpdate(id, payload, {
      new: true
    });

    if (!record)
      return serviceResult(404, null, "auth.profile.user_not_found");

    return serviceResult(200, record, "auth.profile.profile_updated");
    
  } catch (error) {
    throw error;
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
