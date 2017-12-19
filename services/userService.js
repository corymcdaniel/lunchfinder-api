const User = require('mongoose').model('User');

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

exports.create = async (user) => {
  let found = await User.findOne({
    where: {username: user.username}
  });

  if (found) {
    throw new RangeError('Username is taken');
  }

  return User.create(user, {isNewRecord: true});
};

exports.update = (user, fields) => {
  return User.update(user, {
      where:{id: user.id},
      fields: fields,
      returning: true
    });
};

exports.delete = async (userId) => {
  let user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user.destroy()
};
