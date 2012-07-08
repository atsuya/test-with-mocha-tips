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

app.listen(config.app.port, config.app.host);

sioServer.sockets.on('connection', function (socket) {
  socket.on('user.connect', function(data) {
    socket.broadcast.emit('user.connected', data);
  });
  socket.on('user.message', function (data) {
    dataStore.addMessage(data, function(error, result) {
      if (error) {
        console.log(error);
      }
      socket.broadcast.emit('user.messaged', data);
    });
  });
});
