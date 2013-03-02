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

var hasStarted = false;

function onClientConnect(newClient) {
  newClient.player = Object.create(core.player);
  newClient.player.init(newClient.userId);
  newClient.player.socket = newClient;

  newClient.on('bikeInput', function(client) {
    console.log('Client: ' + client.step + ' Server: ' + core.step);
    console.log('Client is ' + (core.step - client.step) + ' steps behind');
    console.log('Start time is ' + core.startTime);
    newClient.player.bike.changeDirection(client.direction);
  });

  serverCore.announcePlayersBeforeGame();

  newClient.on('startGame', function(client) {
    hasStarted = false;
    serverCore.tellClientsToStartLoop(client.userId);
  });


  newClient.on('startServerLoop', function() {
    if(!hasStarted) {
      hasStarted = true;
      startLoop();
    }
  });
}


function startLoop() {
  core.reset();
  core.gameLoop();
}


serverCore = {};


serverCore.tellClientsToStartLoop = function(fromUserId) {
  var data = { initiatingPlayerId: fromUserId };

  core.bikes.forEach(function(bike) {
    bike.player.socket.emit('startGame', data);
  });
};


serverCore.updateClientsGameLoop = function() {
  core.bikes.forEach(function(bike) {
    bike.player.socket.emit('gameState', serverCore.gatherGameState());
  });
};


serverCore.gatherGameState = function() {
  var players = [];

  core.bikes.forEach(function(bike) {
    players.push({
      x:          bike.x,
      y:          bike.y,
      direction:  bike.direction,
      userId:     bike.player.id
    });
  });

  return { step: core.step, players: players };
};


serverCore.announcePlayersBeforeGame = function() {
  core.bikes.forEach(function(bike) {
    bike.player.socket.emit('bikesBeforeStart', serverCore.gatherGameState());
  });
};


function onClientDisconnect(client) {
  core.removeBikeById(client.userId);
  core.endCurrentGame();
}

