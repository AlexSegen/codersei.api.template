const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const tokenService = require("../services/token.service");
const ResponseError = require("../helpers/responseError");

function checkStatus(statusID) {
  switch (statusID) {
    case 1:
      return true;
    case 2:
      throw new ResponseError({
        name: "AuthenticationError",
        code: "USER_BLOCKED",
        message: "auth.user_blocked"
      })
    case 3:
      throw new ResponseError({
        name: "AuthenticationError",
        code: "USER_DISABLED",
        message: "auth.user_disabled"
      });
    default:
      throw new ResponseError({
        name: "AuthenticationError",
        code: "USER_DISABLED",
        message: "auth.unknown_status"
      });
  }
}

function checkPermission(permission) {
  return async (req, res, next) => {
    const { permissions } = await getAuthUser(req, res);

    if (permissions.includes(permission)) return next();

    return res.status(403).json({
      message: "auth.insufficient_scope",
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

    const userRole = user.role || "user";

    const authorizedRole = roles.some((role) => role === userRole);

    return authorizedRole;

  } catch (error) {
    throw error;
  }
}

const isProtected = (roles) => {
  return async (req, res, next) => {
    try {

      const authorization = req.header("authorization");
      
      if (!authorization)
        throw new ResponseError({
          message: "auth.token_not_found",
          name: "AuthorizationError",
          code: "TOKEN_NOT_FOUND",
          statusCode: 403
        });

      if (!checkRoles(roles, req, res))
        throw new ResponseError({
          message: "auth.insufficient_role",
          name: "AuthorizationError",
          code: "ROLE_INSUFFICIENT",
          statusCode: 403
        });
      
      const token = authorization.replace("Bearer ", "");
      if (!tokenService.verifyToken(token))
        throw new ResponseError({
          message: "auth.token_not_valid",
          name: "AuthorizationError",
          code: "TOKEN_INVALID",
          statusCode: 403
        });

        req.user = await getAuthUser(req, res);

        checkStatus(req.user.status);
      
      return next();
      
    } catch (error) {

      if(error instanceof ResponseError) {
        return res.status(error.statusCode).json({
          name: error.name,
          code: error.code,
          message: req.t(error.message)
        });
      }

      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          message: req.t("auth.token_expired"),
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
        message: "auth.token_not_found",
      });

    const token = authorization.replace("Bearer ", "");
    const decoded = tokenService.verifyToken(token);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        name: "AuthenticationError",
        message: "auth.forbidden",
      });
    }

    return user;
  } catch (error) {
    return res.status(401).json({
      name: "AuthenticationError",
      message: req.t(error.message)
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

    const decoded = tokenService.verifyRefreshToken(token);

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

const recoveryToken = async ({ email }) => tokenService.issueRecoveryToken(email);

const decodeToken = (req, res) => {
  try {
    const authorization = req.header("authorization");

    return tokenService.decodeToken(authorization);
    
  } catch (error) {

    if(error instanceof ResponseError) {
      return res.status(error.statusCode).json({
        name: error.name,
        code: error.code,
        message: error.message
      });
    }

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
  recoveryToken,
  isProtected,
  getAuthUser,
  getRefreshTokenUser,
  decodeToken
};
