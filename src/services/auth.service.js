const bcrypt = require("bcryptjs");
const utils = require("utility");
const { v4: uuid } = require("uuid");

const User = require("../models/user.model");
const auth = require("../middleware/auth");	
const tokenService = require("../services/token.service");
const notificationService = require("../services/notification.service");
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

const requestPasswordReset = async (email, translations) => {
  try {

    const user = await User.findOne({ email });

    if (!user)
      return serviceResult(404, null, "auth.user_not_found");

    const token = tokenService.issueRecoveryToken(email);

    return await notificationService.sendRequestPasswordResetEmail(user, token, translations);

  } catch (error) {
    throw error;
  }
}

const checkRecoveryToken = async (token) => {
  try {

    const isValid = tokenService.verifyRecoveryToken(token);

    return serviceResult(200, { success: isValid }, "auth.recovery_token_valid");

  } catch (error) {
    throw error;
  }
}

const resetPassword = async ({password, token}, translations) => {
  try {

    const decoded = tokenService.verifyRecoveryToken(token);

    const user = await User.findOne({ email: decoded.email });

    if (!user)
      return serviceResult(404, null, "auth.user_not_found");

    user.password = bcrypt.hashSync(password, 10);

    await User.findOneAndUpdate(
      { email: decoded.email },
      { password: user.password },
      { new: true }
    );

    await notificationService.sendPasswordUpdatedEmail(user, translations);

    return serviceResult(200, { email: user.email }, "auth.password_reset.password_changed");

  } catch (error) {
    throw error;
  }
}

const updateAvatar = async (user, avatarUrl) => {
  try {

    const record = await User.findByIdAndUpdate(user._id, {
      avatar: avatarUrl
    }, {
      new: true
    });

    if (!record)
      return serviceResult(404, null, "auth.profile.user_not_found");

    return serviceResult(200, record, "auth.profile.avatar_updated");

  } catch (error) {
    throw error;
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  requestPasswordReset,
  checkRecoveryToken,
  resetPassword,
  updateAvatar
};
