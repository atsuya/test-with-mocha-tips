var redis = require('redis');

function DataStore(host, port, prefix) {
  this.client = redis.createClient(port, host);
  this.prefix = prefix;
}

DataStore.prototype.close = function(callback) {
  this.client.quit();
  return callback(null);
};

DataStore.prototype.addUser = function(username, callback) {
  var key = this.key('users');
  this.client.sadd(key, username, function(error, result) {
    return callback(error, result);
  });
};

DataStore.prototype.removeUser = function(username, callback) {
  var key = this.key('users');
  this.client.srem(key, username, function(error, result) {
    return callback(error, result);
  });
};

DataStore.prototype.isUserLoggedIn = function(username, callback) {
  var key = this.key('users');
  this.client.sismember(key, username, function(error, result) {
    if (!error) {
      var exist = (result === 0 ? false : true);
    }
    return callback(error, exist);
  });
};

DataStore.prototype.key = function(name) {
  return this.prefix + name;
};

module.exports = DataStore;
