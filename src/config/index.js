require('dotenv').config()

module.exports = {
    app: process.env.APP,
    port: process.env.PORT || 5100,
    db: process.env.MONGODB_URI,
    secret: process.env.APP_SECRET,
    refresh_secret: process.env.APP_SECRET_REFRESH,
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        security: process.env.STARTTLS,
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD,
        recipient: process.env.SMTP_RECIPIENT,
    },
    cloudinary: {
        cloud: process.env.CLOUD_NAME,
        key: process.env.CLOUD_KEY,
        secret: process.env.CLOUD_SECRET,
        folder: process.env.CLOUD_FOLDER,
    },
    services: {
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    },
    aws: {
        ACCESS_KEY: process.env.AWS_ACCESS_KEY,
        SECRET_KEY: process.env.AWS_SECRET_KEY,
        BUCKET: process.env.AWS_S3_BUCKET,
    },
    front_url: "https://taskerapp.vercel.app/"
}
