'use strict';

const { port } = require('./config');
const { SERVICE_NAME } = require('./constants');
const app = require('./server');

app.listen(port, () => {
  console.log(`${SERVICE_NAME} listening on port ${port}`);
});
