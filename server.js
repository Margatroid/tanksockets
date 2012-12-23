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
