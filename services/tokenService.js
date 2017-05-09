'use strict';

const Token = require('../models').tokens;
const config = require('../config/config');
const moment = require('moment');

exports.get = query => {
  return Token.findOne(query).then(token => {
    return token;
  })
    .catch(err => {
      console.error(err);
      return null;
    });
};

exports.update = (token, fields) => {
  return Token.update(token, {
    where:{id: token.id},
    fields: fields
  });
};

exports.isExpired = (token) => {
  let expireDate = moment(token.last_refreshed_at + config.dwolla.refreshExpireRateHours);
  return moment().isAfter(expireDate);
};