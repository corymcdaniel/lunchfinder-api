module.exports = {
  env: 'development',
  db: {
    mongo: 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/warp-dev',
  },
  port: 3300,
  facebook: {
    appId: '218424208647713',
    secret: 'd3472691bb0a0011c46ee6b5872efeda',
    callback: 'http://localhost:3300/v1/auth/facebook/callback'
  }
};
