module.exports = {
  '/api': {
    // target: 'http://localhost:8080',
    target: 'https://lutaco-api.onrender.com',
    secure: false,
    // secure: true,
    changeOrigin: true,
    logLevel: 'debug',

    headers: {
      // origin: 'http://localhost:8080',
      origin: 'https://lutaco-api.onrender.com',
    },
  },
};
