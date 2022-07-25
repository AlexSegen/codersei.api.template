const mongoose = require('mongoose');
const consola = require('consola');
const config = require('../config');

const MONGODB_URI = config.db;

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', function(e){
  consola.error({
    badge: true,
    message: `Could't connect to Database: ${e.message} \n ${MONGODB_URI}`
  });
});

db.once('open', function() {
  consola.success({
    badge: true,
    message: `Database connected: \n ${MONGODB_URI}`
  });
});

module.exports = db;
