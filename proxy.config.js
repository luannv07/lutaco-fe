module.exports = {
  '/api': {
    target: 'https://lutaco-api.onrender.com',
    secure: true,
    changeOrigin: true,
    logLevel: 'debug',

    headers: {
      origin: 'https://lutaco-api.onrender.com',
    },
  },
};
