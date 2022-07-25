const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const config = require("../config/");
const ResponseError = require("../helpers/responseError");

function checkStatus(statusID) {
  switch (statusID) {
    case 1:
      return true;
    case 2:
      throw new ResponseError({
        name: "AuthenticationError",
        code: "USER_BLOCKED",
        message: "Your user has been blocked."
      })
    case 3:
      throw new ResponseError({
        name: "AuthenticationError",
        code: "USER_DISABLED",
        message: "Your user has been disabled."
      });
    default:
      throw new ResponseError({
        name: "AuthenticationError",
        code: "USER_DISABLED",
        message: "Unknown user status."
      });
  }
}

function checkPermission(permission) {
  return async (req, res, next) => {
    const { permissions } = await getAuthUser(req, res);

    if (permissions.includes(permission)) return next();

    return res.status(403).json({
      message: "You do not have permission to this resource.",
      name: "AuthenticationError",
      code: "PERMISSION_INSUFFICIENT"
    });
  };
}

async function checkRoles(roles, req, res) {

  if (typeof roles === "undefined") {
    return true;
  }

  if (typeof roles === "string") {
    roles = [roles];
  }
  
  try {
    const user = await getAuthUser(req, res);

    checkStatus(user.status);

    const userRole = user.role || "user";

    const authorizedRole = roles.some((role) => role === userRole);

    return authorizedRole;

  } catch (error) {
    throw error;
  }
}

const issueToken = async ({ _id, email, role, permissions }, ) => {
  const token = await jwt.sign(
    { _id, email, permissions, role },
    config.secret,
    {
      expiresIn: "1d",
    }
  );

  const refreshToken = await jwt.sign({ _id, email }, config.refresh_secret, {
    expiresIn: "2d",
  });

  return { token, refreshToken };
};

const isProtected = (roles) => {
  return async (req, res, next) => {


    try {

      const authorization = req.header("authorization");
      if (!authorization)
        throw new ResponseError({
          message: "Not Authorized: Token not found",
          name: "AuthenticationError",
          code: "TOKEN_NOT_FOUND",
          statusCode: 403
        });

      const authorized = await checkRoles(roles, req, res);
      if (!authorized)
        throw new ResponseError({
          message: "You do not have permission to this resource.",
          name: "AuthenticationError",
          code: "ROLE_INSUFFICIENT",
          statusCode: 403
        });
      
      const token = authorization.replace("Bearer ", "");
      if (!jwt.verify(token, config.secret))
        throw new ResponseError({
          message: "Not Authorized: Invalid token",
          name: "AuthenticationError",
          code: "TOKEN_INVALID",
          statusCode: 403
        });
      
      return next();
    } catch (error) {
      
      if(error instanceof ResponseError) {
        return res.status(error.statusCode).json({
          name: error.name,
          code: error.code,
          message: error.message
        });
      }

      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          message: "Your token has expired",
          name: "AuthenticationError",
          code: "TOKEN_EXPIRED",
          statusCode: 401
        });
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  };
};

const getAuthUser = async (req, res) => {
  try {
    const authorization = req.header("authorization");

    if (!authorization)
      return res.status(401).json({
        name: "AuthenticationError",
        message: "Not Authorized: Token not found",
      });

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, config.secret);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        name: "AuthenticationError",
        message: "Not Authorized",
      });
    }

    return user;
  } catch (error) {
    return res.status(401).json({
      name: "AuthenticationError",
      message: error.message,
    });
  }
};

const getRefreshTokenUser = async (req, res) => {
  try {
    const refresh_token = req.header("refresh_token");

    if (!refresh_token)
      return res.status(401).json({
        name: "AuthenticationError",
        message: "Not Authorized: Token not found",
      });

    const token = refresh_token.replace("Bearer ", "");

    const decoded = jwt.verify(token, config.refresh_secret);

    const user = await User.findById(decoded._id);
    if (!user)
    return res.status(401).json({
        name: "AuthenticationError",
        message: "Not Authorized.",
      });

    return user;
  } catch (error) {
    return res.status(401).json({
      name: "AuthenticationError",
      message: "Not Authorized: " + error.message,
    });
  }
};

const recoveryToken = async ({ email }) => {
  const token = await jwt.sign(
    { email },
    config.secret,
    {
      expiresIn: "1h",
    }
  );

  return token;
};

const decodeToken = (req, res) => {
  try {
    const authorization = req.header("authorization");

    if (!authorization)
    return res.status(401).json({
        name: "AuthenticationError",
        message: "Not Authorized: Token not found",
      });

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, config.secret);

    return decoded;
    
  } catch (error) {
    return res.status(401).json({
      name: "AuthenticationError",
      message: error.message,
    });
  }
}

module.exports = {
  checkPermission,
  checkRoles,
  checkStatus,
  issueToken,
  recoveryToken,
  isProtected,
  getAuthUser,
  getRefreshTokenUser,
  decodeToken
};
