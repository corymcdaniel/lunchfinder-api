const path = require('path');
const Koa = require('koa');
const helmet = require('koa-helmet');
const cors = require('kcors');
const logger = require('koa-morgan');
const bodyParser = require('koa-bodyparser');
const static_server = require('koa-static');
const session = require('koa-session');
const passport = require('koa-passport');
const config = require('./config/config');
const MongooseStore = require('koa-session-mongoose');
const mongoose = require('mongoose');
//set mongoose to use native Promises:
mongoose.Promise = Promise;
config.getGlobbedFiles('./models/**/*.js').forEach(function(modelPath) {
  require(path.resolve(modelPath));
});

const api_v1 = require('./routes/api_v1');
const port = process.env.PORT || config.port || 3000;


const app = new Koa();

// Bootstrap db connection
mongoose.connect(config.db.mongo, {useMongoClient: true});
if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true);
}

//initialize passport strategies
require('./config/passport')();

let whitelist = ['http://localhost:8080', 'http://localhost:3000', config.clientUrl];
let corsOptions = {
  origin: function(ctx){
    let originIsWhitelisted = whitelist.indexOf(ctx.headers.origin) !== -1;
    return originIsWhitelisted ? ctx.headers.origin : false;
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(logger('tiny'));
app.use(bodyParser());
app.keys = [process.env.SESSION_KEY || 'sess39852753'];
app.use(session({ store: new MongooseStore()}, app));
app.use(passport.initialize());
app.use(passport.session());

app.use(static_server(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.use(api_v1);

app.listen(port, () => {
  console.log(`Koa server listening on port ${port} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;
