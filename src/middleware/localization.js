const applicableLangs = ["en", "es"];

function localizationMiddleware() {
  return async (req, res, next) => {
    const lng = req.headers['x-language'];

    if (!lng) return next();

    if (!applicableLangs.includes(lng))
      return res.status(400).json({
        message: "Language header incorrect.",
      });

    req.i18n.changeLanguage(lng);

    next();
  };
}


module.exports = { localizationMiddleware };