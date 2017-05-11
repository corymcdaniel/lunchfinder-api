module.exports = {
  env: 'development',
  db: {
    mongo: 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/warp-dev',
  },
  port: 3300,
  foursquare: {
    clientId: 'YWG3A1DHRPLIDUVVHLTKNVYFCC0MIZ0DJPUGZ5FB5QB2IOP1',
    clientSecret: 'BAJE45MW0NOQ22BPM50AJ3QLZ1YU2AZPQ0BCFDTFVZ54RH5W'
  }
};
