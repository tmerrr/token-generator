'use strict';

const { port } = require('./config');
const { serviceName } = require('./constants');
const app = require('./src');

app.listen(port, () => {
  console.log(`${serviceName} listening on port ${port}`);
});
