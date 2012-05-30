var qs    = require('querystring');
var OAuth = require('oauth').OAuth;

var FACTUAL_API_BASE_URI = 'http://api.v3.factual.com';
var DRIVER_HEADER = 'factual-nodejs-driver-1.0';

var Requester = function (key, secret) {
  var customHeaders = {
    "Accept": "*/*",
    "Connection": "close",
    "User-Agent": "Node authentication",
    "X-Factual-Lib": DRIVER_HEADER
  };
  this.oauth = new OAuth(null, null, key, secret, '1.0', null, 'HMAC-SHA1', null, customHeaders);
  this.debug = false;
};

Requester.prototype = {

  startDebug: function () {
    this.debug = true;
  },

  stopDebug: function () {
    this.debug = false;
  },

  get: function () {
    var req = this.parseRequestArgs(arguments);
    req.method = 'get';
    return this.request(req);
  },

  post: function () {
    var req = this.parseRequestArgs(arguments);
    req.method = 'post';
    return this.request(req);
  },

  put: function () {
    var req = this.parseRequestArgs(arguments);
    req.method = 'put';
    return this.request(req);
  },

  delete: function () {
    var req = this.parseRequestArgs(arguments);
    req.method = 'delete';
    return this.request(req);
  },

  request: function (req) {
    if (this.urlRequest(req.method)) {
      if (req.data) {
        var connector = req.url.match(/\?/) ? '&' : '?';
        req.url += connector + req.data;
        req.data = null;
      }
      this.oauth[req.method].call(this.oauth, req.url, null, null, this.getCallback(req));
    } else {
      this.oauth[req.method].call(this.oauth, req.url, null, null, req.data, this.getCallback(req));
    }
  },

  parseRequestArgs: function (args) {
    var req = {};
    var path = this.esc(args[0]);
    req.url = path.match(/^\//) ? FACTUAL_API_BASE_URI + path : path;
    var query, cb;
    if ((typeof args[1]) == 'function') {
      req.data = null;
      req.callback = args[1];
    } else {
      req.data = this.getDataString(args[1]);
      req.callback = args[2];
    }
    return req;
  },

  urlRequest: function (method) {
    return (method == 'get' || method == 'delete'); 
  },

  getDataString: function (query) {
    if (query instanceof Object) {
      var stringifiedQuery = {};
      for (var p in query) stringifiedQuery[p] = (query[p] instanceof Object) ? JSON.stringify(query[p]) : query[p];
      return qs.stringify(stringifiedQuery);
    }
    return query;
  },

  esc: function (str) {
    return str.replace(/\"/g, '%22').replace(/\s/g, '%20');
  },

  getCallback: function (req) {
    var isDebug = this.debug;
    var cb = req.callback;

    return function (error, data) {
      if (isDebug) {
        console.log('|DEBUG| request method:', req.method);
        console.log('|DEBUG| request uri:', req.url);
        if (req.data) console.log('|DEBUG| data:', req.data);
      }

      if (error) {
        if (isDebug) console.log('|DEBUG| request failed:', error);
        return cb(error, null);
      }

      try {
        var res = JSON.parse(data);
      } catch (e) { 
        if (isDebug) console.log('|DEBUG| JSON parse failed:', data);
        return cb(e, null);
      }

      if (res.status != "ok") {
        if (isDebug) console.log('|DEBUG| error response from factual:', res); 
        cb(res, null);
      } else {
        cb(null, res.response);
      }
    };
  }
};


module.exports = Requester;
