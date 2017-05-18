module.exports = {
  env: 'production',
  db: {
    mongo: 'mongodb://' + (process.env.MONGODB_URI || 'localhost') + '/warp-dev',
  },
  port: 8080,
  clientUrl: 'http://localhost:3000',
  facebook: {
    appId: '218424208647713',
    secret: process.env.FACEBOOK_SECRET,
    callback: 'https://lunchfinder-api.herokuapp.com/v1/auth/facebook/callback'
  },
  foursquare: {
    clientId: 'YWG3A1DHRPLIDUVVHLTKNVYFCC0MIZ0DJPUGZ5FB5QB2IOP1',
    clientSecret: 'BAJE45MW0NOQ22BPM50AJ3QLZ1YU2AZPQ0BCFDTFVZ54RH5W'
  }
};