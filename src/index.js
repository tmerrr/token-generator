'use strict';

const { port } = require('./config');
const { serviceName } = require('./constants');
const app = require('./server');

app.listen(port, () => {
  console.log(`${serviceName} listening on port ${port}`);
});
