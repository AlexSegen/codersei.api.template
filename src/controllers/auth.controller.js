const bcrypt = require("bcryptjs");
const ResponseError = require("../helpers/responseError");
const authService = require("../services/auth.service");
const { isEmpty } = require("../helpers/utils");

const hashPassword = async (password) => await bcrypt.hash(password, 10);

const register = async (req, res) => {
  try {
    

		if (isEmpty(req.body.email))
			return res.status(400).json({ message: req.t("auth.email_required") });

    if (isEmpty(req.body.password))
			return res.status(400).json({ message: req.t("auth.password_required") });

    req.body.password = await hashPassword(req.body.password);

    const { statusCode, data, message } = await authService.register(req.body.email, req.body.password);

    if (data == null)
      return res.status(statusCode).json({ message: req.t(message) });

    const { _id, first_name, last_name, email, avatar, status } = data.user;
		const { token, refreshToken } = data;

    return res.status(statusCode).json({ data: {
			user: { _id, first_name, last_name, email, avatar, status },
			token,
			refreshToken,
		}, message: req.t(message) });

  } catch (error) {
    return res.status(500).json({  message: error.message });
  }
};

const login = async (req, res) => {
  try {

		if (isEmpty(req.body.email))
			return res.status(400).json({ message: req.t("auth.email_required") });

    if (isEmpty(req.body.password))
			return res.status(400).json({ message: req.t("auth.password_required") });

    const user = req.body;
    const { statusCode, data, message } = await authService.login(user);

    if (data == null)
      return res.status(statusCode).json({ message: req.t(message) });

		const { _id, first_name, last_name, email, avatar, status } = data.user;
		const { token, refreshToken } = data;

    return res.status(statusCode).json({ data: {
			user: { _id, first_name, last_name, email, avatar, status },
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
    
    return res.status(200).json({ data: req.user, message: req.t("auth.profile.user_profile") });

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

    if (isEmpty(req.body.first_name))
      return res.status(400).json({ message: req.t("auth.profile.first_name_required") });

    if (isEmpty(req.body.last_name))
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

const updateAvatar = async (req, res) => {
  try {

    const user = req.user;

    if (!req.file)
      return res.status(400).json({ message: req.t("auth.profile.avatar_required") });

    const { statusCode, data, message } = await authService.updateAvatar(user._id, req.file.url);

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
}

const updatePassword = async (req, res) => {
  try {

    const user = req.user;

    let password = req.body.password;

    if (isEmpty(password))
      return res.status(400).json({ message: req.t("auth.profile.password_required") });

    password = await hashPassword(req.body.password);

    const { statusCode, data, message } = await authService.updatePassword(user, password);

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
}

const requestPasswordReset = async (req, res) => {
  try {

    if (isEmpty(req.body.email))
      return res.status(400).json({ message: req.t("auth.email_required") });

      const translations = {
        subject: req.t("auth.password_reset.subject"),
        paragraph1: req.t("auth.password_reset.paragraph1"),
        paragraph2: req.t("auth.password_reset.paragraph2"),
        cta: req.t("auth.password_reset.cta"),
      }

    const { statusCode, data, message } = await authService.requestPasswordReset(req.body.email, translations);

    return res.status(statusCode).json({ data, message: req.t(message) });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const checkRecoveryToken = async (req, res) => {
  try {

    if (isEmpty(req.params.token))
      return res.status(400).json({ message: req.t("auth.token_not_found") });

    const { statusCode, data, message } = await authService.checkRecoveryToken(req.params.token);

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
}

const resetPassword = async (req, res) => {
  try {

    const token = req.params.token;
    let password = req.body.password;

    if (!password)
      return res.status(400).json({ message: req.t("auth.password_required") });

    if (!token)
      return res.status(400).json({ message: req.t("auth.token_not_found") });


      password = await hashPassword(req.body.password);

      const translations = {
        subject: req.t("auth.password_reset_notification.subject"),
        paragraph1: req.t("auth.password_reset_notification.paragraph1"),
        paragraph2: req.t("auth.password_reset_notification.paragraph2"),
        cta: req.t("auth.password_reset_notification.cta"),
        link: req.t("auth.password_reset_notification.link"),
      }

    const { statusCode, data, message } = await authService.resetPassword({ password, token }, translations);

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
}



module.exports = {
  register,
  login,
	profile,
  updateProfile,
  requestPasswordReset,
  checkRecoveryToken,
  resetPassword,
  updateAvatar,
  updatePassword
};
