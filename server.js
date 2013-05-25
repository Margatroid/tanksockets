var uuid = require('node-uuid');

var app  = require('express')(),
  server = require('http').createServer(app),
  sio    = require('socket.io').listen(server, { log: false });

var core = require('./core');

var world     = new core.World();
world.clients = [];

var lobby = new Lobby();

core.World.prototype.announceTanksToClients = function announceTanks() {
  this.clients.forEach(function(client){
    client.emit('announceTanksToClients', this.tanks);
  });
};

core.World.prototype.gameLoopCallback = function gameLoopCallback() {
  this.announceTanksToClients();
};

function Lobby() {}

Lobby.prototype.onNewClientConnect = function onNewClientConnect(client) {
  client.userId = uuid();
  client.emit('onNewClientConnect', { userId: client.userId });

  client.on('disconnect', function() {
    lobby.onClientDisconnect(client);
  });

  var newTank = new core.Tank();
  newTank.userId = client.userId;
  world.addTank(newTank);
  client.tank = newTank;

  console.log(Date() + ' ' + client.userId + ' connected.');

  world.gameLoop();
};

Lobby.prototype.onClientDisconnect = function onNewClientDisconnect(client) {
  console.log(Date() + ' ' + client.userId + ' disconnected.');
  world.removeTankByUserId(client.tank.userId);
  console.log('Tanks remaining: ');
  console.log(world.tanks);
};

sio.configure(function() {
  sio.set('authorization', function(handshakeData, callback) {
    callback(null, true);
  });

  sio.set('log_level', 1);
});

sio.sockets.on('connection', lobby.onNewClientConnect);

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

server.listen(3000);