require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const authentications = require('./api/authentications');
const collaborations = require('./api/collaborations');
const notes = require('./api/notes');
const users = require('./api/users');
const _exports = require('./api/exports');
const uploads = require('./api/uploads');
const StorageService = require('./services/S3/StorageService');

const init = async () => {
  const storageService = new StorageService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: notes,
    },
    {
      plugin: users,
    },
    {
      plugin: authentications,
    },
    {
      plugin: collaborations,
    },
    {
      plugin: _exports,
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
