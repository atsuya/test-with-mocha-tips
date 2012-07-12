var express = require('express')
  , sio = require('socket.io')
  , config = require('config');

var DataStore = require('./lib/data-store')
  , dataStore = new DataStore(
        config.store.post
      , config.store.port
      , config.store.prefix
    );

var app = module.exports = express.createServer()
  , sioServer = sio.listen(app);

sioServer.configure(function() {
  sioServer.set('log level', config.socketio.log.level);
  sioServer.set('transports', ['websocket']);
});
app.listen(config.app.port, config.app.host);

sioServer.sockets.on('connection', function (socket) {
  socket.on('user.connect', function(data, callback) {
    dataStore.addUser(data.username, function(error, result) {
      callback('user added');
    });
  });
  socket.on('user.message', function (data, callback) {
    callback('mesage sent');
    socket.broadcast.emit('user.messageReceived', data);
  });
});
