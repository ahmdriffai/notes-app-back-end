const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server) => {
    const exportsHandler = new ExportsHandler();
    server.route(routes(exportsHandler));
  },
};
