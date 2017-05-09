'use strict';

var User = require('mongoose').model('User');

exports.get = id => {
  return User.findOne({
    where: { id: id },
    attributes: { exclude: ['password', 'salt'] }
  });
};

exports.list = options => {
  return User.findAll({
    attributes: {
      exclude: ['password', 'salt']
    },
    where: options
  });
};

exports.create = user => {
  return User.findOne({
        where: {username: user.username}
      })
      .then(user => {
        if (user) {
          throw new RangeError('Username is taken');
        }
        return;
      })
      .then(() => {
        return User.create(user, {isNewRecord: true});
      });
};

exports.update = (user, fields) => {
  return User.update(user, {
      where:{id: user.id},
      fields: fields,
      returning: true
    });
};

exports.delete = userId => {
  return User.findById(userId)
    .then(user => {
      if (!user) {
        throw new Error('User not found');
      }
      return user.destroy()
    });
};
