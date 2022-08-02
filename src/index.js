const path = require('path');
const express = require("express");
const consola = require('consola');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const i18next = require('i18next');
const Backend = require('i18next-node-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');


i18next.use(Backend).use(i18nextMiddleware.LanguageDetector)
  .init(
    {
      backend: {
        loadPath: path.resolve(__dirname, '../resources/locales/{{lng}}/{{ns}}.json')
      },
      debug: false,
      detection: {
        order: ['querystring', 'cookie'],
        caches: ['cookie']
      },
      saveMissing: true,
      fallbackLng: 'en',
      preload: ['en', 'es']
    },
    (err, t) => {
      if (err) return console.error(err);
      console.log('i18next is ready...');
      console.log(t('greeting'));
      console.log(t('greeting', { lng: 'es' }));
    }
);

const { swaggerDocs: V1SwaggerDocs } = require("./routes/v1/swagger");

const config = require('./config');
const routes = require('./routes/index');

const db = require('./database/mongoose');
db;

const app = express();

app.use(i18nextMiddleware.handle(i18next));

app.get('/greeting', (req, res) => {
  const response = req.t('greeting');
  res.status(200);
  res.send(response);
});

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
