require('dotenv').config();

const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: notes,
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
