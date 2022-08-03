const fs = require("fs");
const path = require('path');

const config = require("../config");
const useSendgrid = require("../infrastructure/sendgrid");
const { serviceResult } = require("../helpers/serviceResult");

const templatesPath = path.join(__dirname, './resources/templates/');

const sendRequestPasswordResetEmail = async ({ first_name, email }, token, t) => {
  try {
    let html = fs
      .readFileSync("./src/resources/templates/recovery-link.txt")
      .toString()
      .replace("{{subject}}", t.subject)
      .replace("{{paragraph1}}", t.paragraph1)
      .replace("{{paragraph2}}", t.paragraph2)
      .replace("{{cta}}", t.cta)
      .replace("{{first_name}}", first_name)
      .replace("{{token}}", token)
      .replace(/{{front_url}}/gi, config.front_url);

    const msg = {
      from: config.smtp.username,
      to: email,
      subject: `🔑 ${config.app}: ${t.subject}.`,
      html,
    };

    await useSendgrid(msg);

    return serviceResult(
      200,
      {
        success: true
      },
      "auth.password_reset.success"
    );
  } catch (error) {
    return serviceResult(
        500,
        null,
        error.message
      );
  }
};

const sendPasswordUpdatedEmail = async ({ first_name, email }, t) => {
  try {
    let html = fs
      .readFileSync("./src/resources/templates/password-updated.txt")
      .toString()
      .replace("{{subject}}", t.subject)
      .replace("{{paragraph1}}", t.paragraph1)
      .replace("{{paragraph2}}", t.paragraph2)
      .replace("{{cta}}", t.cta)
      .replace("{{first_name}}", first_name)
      .replace("{{link}}", t.link)
      .replace(/{{front_url}}/gi, config.front_url);

    const msg = {
      from: config.smtp.username,
      to: email,
      subject: `🔑 ${config.app}: ${t.subject}.`,
      html,
    };

    await useSendgrid(msg);

    return serviceResult(
      200,
      {
        success: true
      },
      ""
    );
  } catch (error) {
    return serviceResult(
        500,
        null,
        error.message
      );
  }
};

module.exports = {
    sendRequestPasswordResetEmail,
    sendPasswordUpdatedEmail,
}
