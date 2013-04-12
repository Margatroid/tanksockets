var uuid = require('node-uuid');

var app  = require('express')(),
  server = require('http').createServer(app),
  sio    = require('socket.io').listen(server, { log: false });

var core = require('./core');

server.listen(3000);

sio.configure(function() {
  sio.set('authorization', function(handshakeData, callback) {
    callback(null, true);
  });

  sio.set('log_level', 1);
});


sio.sockets.on('connection', function(client) {
  client.userId = uuid();

  client.emit('onconnected', { id: client.userId } );
  console.log(Date() + ' ' + client.userId + ' connected.');

  client.on('disconnect', function() {
    console.log(Date() + ' ' + client.userId + ' disconnected.');
  });

  server.addPlayer(client);
});


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


function Server() {
};


Server.prototype.addPlayer = function addClient(client) {
  var player = new core.Player(client.uuid);
};


server = new Server();