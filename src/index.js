'use strict';

const { port } = require('./config');
const { SERVICE_NAME } = require('./constants');
const { tokensRepository } = require('./repositories');
const app = require('./server');

app.listen(port, async () => {
  await tokensRepository.init();
  console.log(`${SERVICE_NAME} listening on port ${port}`);
});
