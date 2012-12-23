var express = require('express');
var io      = require('socket.io');
var uuid    = require('node-uuid');
var app     = express();

var sio = io.listen(app);

sio.configure(function() {
  sio.set('authorization', function(handshakeData, callback) {
    callback(null, true);
  });
});

sio.sockets.on('connection', function(client) {
  client.userId = UUID();

  client.emit('onconnected', { id: client.userId } );

  console.log(Date() + ' ' + client.userId + ' connected.');

  client.on('disconnect', function() {
    console.log(Date() + ' ' + client.userId + ' disconnected.');
  });

});

