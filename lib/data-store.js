var redis = require('redis');

function DataStore(host, port, prefix) {
  this.client = redis.createClient(port, host);
  this.prefix = prefix;
}

DataStore.prototype.close = function(callback) {
  this.client.quit();
  return callback(null);
};

DataStore.prototype.addMessage = function(message, callback) {
  var key = this.key('messages');
  this.client.rpush(key, message, function(error, result) {
    return callback(error, result);
  });
};

DataStore.prototype.getMessages = function(callback) {
  var key = this.key('messages');
  this.client.lrange(key, 0, 9, function(error, result) {
    return callback(error, result);
  });
};

DataStore.prototype.key = function(name) {
  return this.prefix + name;
};

module.exports = DataStore;
