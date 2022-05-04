const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { service }) => {
    const notesHandler = new UsersHandler(service);
    server.route(routes(notesHandler));
  },
};
