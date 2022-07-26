const jwt = require("jsonwebtoken");
const config = require("../config");
const ResponseError = require("../helpers/responseError");
const { serviceResult } = require("../helpers/serviceResult");

const issueToken = ({ _id, email, role, permissions }) => {
    const token = jwt.sign(
      { _id, email, permissions, role },
      config.secret,
      {
        expiresIn: "1d",
      }
    );
  
    const refreshToken = jwt.sign({ _id, email }, config.refresh_secret, {
      expiresIn: "2d",
    });
  
    return { token, refreshToken };
};

const verifyToken = token => {
  try {

    return jwt.verify(token, config.secret);
    
  } catch (error) {
    if (error.name == "JsonWebTokenError")
      throw new ResponseError({
        message: "auth.token_not_valid",
        name: "AuthorizationError",
        code: "TOKEN_INVALID",
        statusCode: 403
      });

    if (error instanceof jwt.TokenExpiredError)
      throw new ResponseError({
        message: "auth.token_expired",
        name: "AuthenticationError",
        code: "TOKEN_EXPIRED",
        statusCode: 401
      });
      

      throw error;
  }
}

const verifyRefreshToken = token => {
  return jwt.verify(token, config.refresh_secret);
}

const decodeToken = authorizationHeader => {
  try {

    if (!authorizationHeader)
      throw new ResponseError({
        name: "AuthenticationError",
        message: "Not Authorized: Token not found",
        statusCode: 401,
      });

    const token = authorizationHeader.replace("Bearer ", "");
    const decoded = verifyToken(token);

    return decoded;
    
  } catch (error) {
    throw error;
  }
}

const issueRecoveryToken = email => {
  const token = jwt.sign(
    { email, recovery: true },
    config.secret,
    {
      expiresIn: "1h",
    }
  );

  return token;
};

const verifyRecoveryToken = token => {
  try {

    const decoded = verifyToken(token);

    if (!decoded.recovery)
      throw new ResponseError({
        message: "auth.token_not_valid",
        name: "AuthorizationError",
        code: "TOKEN_INVALID",
        statusCode: 403
      });

    return decoded;
    
  } catch (error) {

    if (error.name == "JsonWebTokenError")
      throw new ResponseError({
        message: "auth.token_not_valid",
        name: "AuthorizationError",
        code: "TOKEN_INVALID",
        statusCode: 403
      });

    if (error instanceof jwt.TokenExpiredError)
      throw new ResponseError({
        message: "auth.token_expired",
        name: "AuthenticationError",
        code: "TOKEN_EXPIRED",
        statusCode: 401
      });
    
      throw error;
  }
}

module.exports = { verifyToken, verifyRefreshToken, issueToken, issueRecoveryToken, verifyRecoveryToken, decodeToken };