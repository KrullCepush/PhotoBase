const reqHelpers = {};

reqHelpers.getUserNickname = function(req) {
  return req.user && req.user.username;
};

module.exports = reqHelpers;
