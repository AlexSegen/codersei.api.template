const config = require('../config');
const sgMail = require('@sendgrid/mail');

function useSendgrid({ to, from, subject, html, text }) {
    try {
        
        sgMail.setApiKey(config.services.SENDGRID_API_KEY);
        return sgMail.send({ to, from, subject, html, text });

    } catch (error) {
        throw new Error("Couldn't send email.")
    }
}

module.exports = useSendgrid;