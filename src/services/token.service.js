const jwt = require("jsonwebtoken");
const config = require("../config");

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
    return jwt.verify(token, config.secret);
}

module.exports = { verifyToken, issueToken};