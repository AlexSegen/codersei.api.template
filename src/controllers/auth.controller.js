const ResponseError = require("../helpers/responseError");
const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const user = req.body;
    const { statusCode, data, message } = await authService.register(user);

    return res.status(statusCode).json({ data, message });
  } catch (error) {
    return res.status(500).json({  error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const user = req.body;
    const { statusCode, data, message } = await authService.login(user);

		const { _id, first_name, last_name, email, avatar } = data.user;
		const { token, refreshToken } = data;

    return res.status(statusCode).json({ data: {
			user: { _id, first_name, last_name, email, avatar },
			token,
			refreshToken,
		}, message });

  } catch (error) {
    if (error instanceof ResponseError)
      return res.status(error.statusCode).json({
        name: error.name,
        code: error.code,
        message: error.message,
      });

    return res.status(500).json({ error: error.message });
  }
};

const profile = async (req, res) => {
  try {
    
		const authorization = req.header("authorization");
    
		const { statusCode, data, message } = await authService.getProfile(authorization);

    return res.status(statusCode).json({ data, message });

  } catch (error) {
    if (error instanceof ResponseError)
      return res.status(error.statusCode).json({
        name: error.name,
        code: error.code,
        message: error.message,
      });

    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
	profile
};
