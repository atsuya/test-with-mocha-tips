var redis = require('redis');

function RedisCleaner(host, port, prefix) {
  this.host = host;
  this.port = port;
  this.prefix = prefix;
}

RedisCleaner.prototype.createClient = function() {
  return redis.createClient(this.port, this.host);
};

RedisCleaner.prototype.clean = function(callback) {
  var client = this.createClient()
    , key = this.prefix + '*';
  client.keys(key, function(error, response) {
    if (error || response.length <= 0) {
      return callback(error);
    } else {
      client.del(response, function(error, response) {
        return callback(error);
      });
    }
  });
};

module.exports = RedisCleaner;
