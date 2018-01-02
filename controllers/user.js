const _ = require('lodash');
const userService = require('../services/userService');

exports.get = async (req, res, next) => {
  let id = req.params.userId;
  if (!id) return res.status(400).send('Missing id');

  try {
    let user = userService.get(id);
    return res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    let users = await userService.list(req.query);
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  let fields = Object.keys(req.body);
  _.remove(fields, (f) => f === 'id');

  if (fields.indexOf('username') > -1) {
    //TODO: Search for the username before allowing an update
  }

  try {
    let updated = await userService.update(req.body, fields);
    if (updated[0] > 0) {
      return res.status(202).json(updated[1][0].toJSON());
    }
  } catch (err) {
    return next(err);
  }
  return res.status(500).send();
};

exports.delete = (req, res, next) => {
  if (!req.body.id) return res.status(400).send('Missing id');
  userService.delete(req.body.id)
    .then(() => res.status(200).send())
    .catch(next);
};
