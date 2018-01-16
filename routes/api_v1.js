const Router = require('koa-router');
const router = new Router();
const open = require('./public');
const secured = require('./secured');

router.prefix('/v1');
router.use(open);
router.use(secured);

module.exports = router.routes();