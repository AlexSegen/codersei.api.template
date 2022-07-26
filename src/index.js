const express = require("express");
const consola = require('consola');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { swaggerDocs: V1SwaggerDocs } = require("./routes/v1/swagger");

const config = require('./config');
const routes = require('./routes/index');

const db = require('./database/mongoose');
db;

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

app.listen(config.port, () => {

  V1SwaggerDocs(app, config.port);

  consola.success({
    badge: true,
    message: `🚀 Server running at: \n http://localhost:${config.port}/api`
  });
});
