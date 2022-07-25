const express = require("express");

const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
