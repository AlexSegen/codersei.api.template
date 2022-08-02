const ResponseError = require("../helpers/responseError");
const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {

		if (!req.body.email)
			return res.status(400).json({ message: req.t("auth.email_required") });

    if (!req.body.password)
			return res.status(400).json({ message: req.t("auth.password_required") });

    const user = req.body;

    const { statusCode, data, message } = await authService.register(user);

    if (data == null)
      return res.status(statusCode).json({ message: req.t(message) });

    const { _id, first_name, last_name, email, avatar } = data.user;
		const { token, refreshToken } = data;

    return res.status(statusCode).json({ data: {
			user: { _id, first_name, last_name, email, avatar },
			token,
			refreshToken,
		}, message: req.t(message) });

  } catch (error) {
    return res.status(500).json({  message: error.message });
  }
};

const login = async (req, res) => {
  try {

		if (!req.body.email)
			return res.status(400).json({ message: req.t("auth.email_required") });

    if (!req.body.password)
			return res.status(400).json({ message: req.t("auth.password_required") });

    const user = req.body;
    const { statusCode, data, message } = await authService.login(user);

    if (data == null)
      return res.status(statusCode).json({ message: req.t(message) });

		const { _id, first_name, last_name, email, avatar } = data.user;
		const { token, refreshToken } = data;

    return res.status(statusCode).json({ data: {
			user: { _id, first_name, last_name, email, avatar },
			token,
			refreshToken,
		}, message: req.t(message) });

  } catch (error) {
    if (error instanceof ResponseError)
      return res.status(error.statusCode).json({
        name: error.name,
        code: error.code,
        message: req.t(error.message)
      });

    return res.status(500).json({ message: error.message });
  }
};

const profile = async (req, res) => {
  try {
    
		const authorization = req.header("authorization");
    
		const { statusCode, data, message } = await authService.getProfile(authorization);

    return res.status(statusCode).json({ data, message: req.t(message) });

  } catch (error) {
    if (error instanceof ResponseError)
      return res.status(error.statusCode).json({
        name: error.name,
        code: error.code,
        message: req.t(error.message)
      });

    return res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    
		const user = req.user;

    if (!req.body.first_name)
      return res.status(400).json({ message: req.t("auth.profile.first_name_required") });

    if (!req.body.last_name)
      return res.status(400).json({ message: req.t("auth.profile.last_name_required") });

    const payload = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      about: req.body.about  ?? "",
      phone: req.body.phone  ?? "",
      address: req.body.address  ?? ""
    };

    const { statusCode, data, message } = await authService.updateProfile(user._id, payload);

    return res.status(statusCode).json({ data, message: req.t(message) });

  } catch (error) {
    if (error instanceof ResponseError)
      return res.status(error.statusCode).json({
        name: error.name,
        code: error.code,
        message: req.t(error.message),
      });

    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
	profile,
  updateProfile
};
