const config = require('../config');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: true, // true for 465, false for other ports
    auth: {
        user: config.smtp.username,
        pass: config.smtp.password
    }
});

function sendEmail({from, to, subject, html}) {
	return transporter.sendMail({ from, to, subject, html,
		//text: text
	});
};

module.exports = sendEmail;