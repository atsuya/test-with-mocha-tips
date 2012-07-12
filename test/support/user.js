var sio = require('socket.io-client')
  , async = require('async')
  , underscore = require('underscore');

function User(url, data) {
  this.url = url;
  this.data = underscore.extend({}, data);
  this.connection = null;
}

User.prototype.connect = function(callback) {
  var self = this;

  self.connection = sio.connect(self.url, {
      'force new connection': true
    , transports: ['websocket']
    , reconnect: false
  });
  self.connection.on('connect', function() {
    var message = { username: self.data.username };
    self.connection.emit('user.connect', message, function(data) {
      callback(null);
    });
  });
};

User.prototype.disconnect = function(callback) {
  this.connection.disconnect();
  callback(null);
};

User.prototype.sendMessage = function(message, callback) {
  this.connection.emit('user.message', message, function(data) {
    callback(null);
  });
};

module.exports = User;
