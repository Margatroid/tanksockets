var uuid    = require('node-uuid');
var app     = require('express')(),
  server = require('http').createServer(app),
  sio    = require('socket.io').listen(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

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

