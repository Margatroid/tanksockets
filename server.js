var uuid = require('node-uuid');

var app  = require('express')(),
  server = require('http').createServer(app),
  sio    = require('socket.io').listen(server, { log: false });

var core = require('./core');

var world = new core.World();
var lobby = new Lobby();

server.listen(3000);

/*
sio.sockets.on('connection', function(client) {
  client.userId = uuid();

  client.emit('onconnected', { id: client.userId } );
  console.log(Date() + ' ' + client.userId + ' connected.');

  client.on('disconnect', function() {
    console.log(Date() + ' ' + client.userId + ' disconnected.');
  });
});
*/

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/core.js', function (req, res) {
  res.sendfile(__dirname + '/core.js');
});

app.get('/client.js', function (req, res) {
  res.sendfile(__dirname + '/client.js');
});

app.get('/0.9.15.min.js', function (req, res) {
  res.sendfile(__dirname + '/0.9.15.min.js');
});

function Lobby() {}

Lobby.prototype.onNewClientConnect = function onNewClientConnect(client) {
  client.userId = uuid();
  client.emit('From server: Connection established. You are ' + client.userId);
  console.log(Date() + ' Player ' + client.userId + ' connected.');
};

Lobby.prototype.onClientDisconnect = function onNewClientDisconnect() {

};

sio.configure(function() {
  sio.set('authorization', function(handshakeData, callback) {
    callback(null, true);
  });

  sio.set('log_level', 1);
});

sio.sockets.on('connection', lobby.onNewClientConnect);