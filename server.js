var uuid = require('node-uuid');

var app  = require('express')(),
  server = require('http').createServer(app),
  sio    = require('socket.io').listen(server);

var core = require('./core');

server.listen(3000);

sio.configure(function() {
  sio.set('authorization', function(handshakeData, callback) {
    callback(null, true);
  });
});

var clients = [];

sio.sockets.on('connection', function(client) {
  client.userId = uuid();

  client.emit('onconnected', { id: client.userId } );

  console.log(Date() + ' ' + client.userId + ' connected.');

  onClientConnect(client);

  client.on('disconnect', function() {
    onClientDisconnect(client);
    console.log(Date() + ' ' + client.userId + ' disconnected.');
  });
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/core.js', function (req, res) {
  res.sendfile(__dirname + '/core.js')
});

app.get('/client.js', function (req, res) {
  res.sendfile(__dirname + '/client.js');
});

function onClientConnect(newClient) {
  core.startTime = new Date();

  newClient.player = Object.create(core.player);
  newClient.player.init();

  newClient.on('bikeInput', function(client) {
    newClient.player.bike.changeDirection(client.direction);
  });

  core.gameLoop();
}

function onClientDisconnect(client) {
  core.stopLoop();
}



