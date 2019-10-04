const reqHelpers = {};

reqHelpers.getUserNickname = function(req) {
  return req.user && req.user.nickname;
};

module.exports = reqHelpers;
