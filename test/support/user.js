var sio = require('socket.io-client')
  , async = require('async');

function User(url, data) {
  this.url = url;
  this.data = data;
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
    var message = { username: self.data.username, user_id: self.data.id, action: 'connect' };
    self.connection.json.send(message);
    setTimeout(function() { callback(null); }, 500);
  });
};

User.prototype.disconnect = function(callback) {
  this.connection.disconnect();
  callback(null);
};

User.prototype.sendMessage = function(message, callback) {
  this.connection.json.send(message);
  callback(null);
};

module.exports = User;
