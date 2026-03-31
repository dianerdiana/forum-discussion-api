import config from './commons/config.js';
import { container } from './infrastructures/container/index.container.js';
import { createServer } from './infrastructures/http/create-server.js';

import 'dotenv/config';

const start = async () => {
  const app = await createServer(container);
  const { host, port } = config.app;

  app.listen(port, host, () => {
    console.log(`server start at http://${host}:${port}`);
  });
};

start();
