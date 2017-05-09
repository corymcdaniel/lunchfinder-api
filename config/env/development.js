module.exports = {
  env: 'development',
  db: {
    mongo: 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/warp-dev',
  },
  port: 3300,
};
