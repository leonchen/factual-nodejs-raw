var Requester = require('./lib/requester');

var Factual = function (key, secret) {
  this.requester = new Requester(key, secret);
};

Factual.prototype = {

  startDebug: function () {
    this.requester.startDebug();
  },

  stopDebug: function () {
    this.requester.stopDebug();
  },

  get: function () {
    return this.requester.get.apply(this.requester, arguments);
  },

  post: function () {
    return this.requester.post.apply(this.requester, arguments);
  }

};

module.exports = Factual;
