var uuid = require('node-uuid');

var app  = require('express')(),
  server = require('http').createServer(app),
  sio    = require('socket.io').listen(server, { log: false });

var core = require('./core');

var world   = new core.World();
var clients = [];// @TODO Move this somewhere more logical.

var lobby = new Lobby();

core.World.prototype.sendToClients = function sendToClients(signalName, data) {
  clients.forEach(function(client) {
    client.emit(signalName, data);
  });

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

  world.sendTankAndWorldTo(client);
  lobby.handleClientReq(client);

  clients.push(client);

  console.log(Date() + ' ' + client.userId + ' connected.');
};

Lobby.prototype.handleClientReq = function handleClientReq(client) {
  client.on('onStartButtonClick', world.startGameLoop);
};

core.World.prototype.startGameLoop = function startGameLoop() {
  world.startLoop();
  world.sendToClients('startGameLoop', world.tanks);
};

core.World.prototype.sendTankAndWorldTo = function sendTankAndWorldTo(client) {
  console.log(world);
  var tankAndWorld = { tank: client.tank, world: world };

  client.emit('sendTankAndWorldTo', tankAndWorld);
};

Lobby.prototype.onClientDisconnect = function onNewClientDisconnect(client) {
  console.log(Date() + ' ' + client.userId + ' disconnected.');
  world.removeTankByUserId(client.tank.userId);
  world.removeClientByUserId(client.tank.userId);
};

core.World.prototype.removeClientByUserId =
  function removeClientByUserId(userId) {
    for (var index in clients) {
      if (clients[index].userId == userId) {
        delete clients[index];
      }
    }

    // Empty array of empty elements.
    clients = clients.filter(function(n){ return n; });
  };

sio.configure(function() {
  sio.set('authorization', function(handshakeData, callback) {
    callback(null, true);
  });

  sio.set('log_level', 1);
});

sio.sockets.on('connection', lobby.onNewClientConnect);

// Routes.
app.get('*', function(req,res) {
  var files
    = ['/core.js', '/client.js', '/style.css', '/fabric-0.9.15.min.js'];

  var path = req.params[0];

  if (files.indexOf(path) > -1) {
    res.sendfile(__dirname + path);
  } else if (path == '/') {
    res.sendfile(__dirname + '/index.html');
  } else {
    res.status(404).send('Error 404: Not found');
  }
});

server.listen(3000);