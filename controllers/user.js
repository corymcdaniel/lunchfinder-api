'use strict';

const _ = require('lodash');
const userService = require('../services/userService');

exports.get = (req, res, next) => {
  let id = req.params.userId;
  if (!id) return res.status(400).send('Missing id');
  return userService.get(id)
    .then(user => {
      res.json(user)
    })
    .catch(next);
};

exports.list = (req, res, next) => {
  userService.list(req.query).then(users => res.json(users))
    .catch(next);
};

exports.update = (req, res, next) => {
  let fields = Object.keys(req.body);
  _.remove(fields, (f) => f === 'id');

  if (fields.indexOf('username') > -1) {
    //TODO: Search for the username before allowing an update
  }

  userService.update(req.body, fields)
    .then((updated) => {
      if (updated[0] > 0) {
        return res.status(202).json(updated[1][0].toJSON());
      }
      return res.status(500).send();
    })
    .catch(next);
};

exports.delete = (req, res, next) => {
  if (!req.body.id) return res.status(400).send('Missing id');
  userService.delete(req.body.id)
    .then(() => res.status(200).send())
    .catch(next);
};
