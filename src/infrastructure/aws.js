const shortid = require("shortid");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const config = require('../config');

const s3 = new aws.S3({
  accessKeyId: config.aws.ACCESS_KEY,
  secretAccessKey: config.aws.SECRET_KEY,
});

const s3UploadMiddleware = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.aws.BUCKET,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, shortid.generate() + "-" + file.originalname);
    },
  }),
});

module.exports = s3UploadMiddleware;
