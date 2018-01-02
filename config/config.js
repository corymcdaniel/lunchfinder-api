const _ = require('lodash');
const glob = require('glob');

const env = process.env.NODE_ENV || 'development';

module.exports = _.extend(
  require('./env/all'),
  require('./env/' + env) || {}
);

//This should be moved into a core library:

/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = (globPatterns, removeRoot) => {
  // For context switching
  let _this = this;

  // URL paths regex
  let urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  let output = [];

  // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach((globPattern) => {
      output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      glob(globPatterns, {
        sync: true
      }, (err, files) => {
        if (removeRoot) {
          files = files.map(file => {
            return file.replace(removeRoot, '');
          });
        }

        output = _.union(output, files);
      });
    }
  }

  return output;
};
