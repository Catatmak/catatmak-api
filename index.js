const Hapi = require('@hapi/hapi');
const routes = require('./bin/routes/routes');
require('dotenv').config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: require('hapi-mongodb'),
    options: {
      url: process.env.MONGODB_URL,
      settings: {
        useUnifiedTopology: true,
      },
      decorate: true,
    },
  });

  server.auth.scheme('auth-scheme', () => {
    return {
      authenticate: async (req, h) => {
        try {
          const authorizationHeader = req.headers.authorization;

          if (!authorizationHeader) {
            throw new Error('Token does not exist');
          }

          const token = authorizationHeader.replace('Bearer ', '');
          // eslint-disable-next-line max-len
          const checkToken = await req.mongo.db.collection('users').findOne({token: token});

          if (!checkToken) {
            throw new Error('Token does not match');
          }

          const credentials = {
            token: checkToken.token,
            phone: checkToken.phone_hmac,
            phoneEncrypt: checkToken.phone,
          };

          return h.authenticated({credentials});
        } catch (error) {
          return h
              .response({
                status: 'failed',
                code: 401,
                message: error.message,
              })
              .code(401)
              .takeover();
        }
      },
    };
  });

  server.auth.strategy('auth-catatmak', 'auth-scheme');

  server.route(routes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
