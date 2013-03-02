(function(){
  var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;
})();

var client = {};

var socket = io.connect('/');

function establishConnection() {
  socket.on('onconnected', function(data) {
    console.log('Received UUID of ' + data.id + ' from socket.io');

    var localPlayer = Object.create(core.player);
    localPlayer.init(data.id);
    addInputHandlersToPlayer(localPlayer);

    client.player = localPlayer;
  });

  socket.on('bikesBeforeStart', function(state) {
    client.resetStartingPositions(state);
  });

  socket.on('gameState', function(state) {
    canvasHelper.processIncomingState(state);
  });

  socket.on('startGame', function(data) {
    if(data.initiatingPlayerId != client.player.id) {
      client.init();
    }
  });
}


var canvasHelper = {
  blockSize: 5,
  maxTiles: { height: 180, width: 350 },
  stateBuffer: []
};


// TODO Add interpolation somehow.
canvasHelper.processIncomingState = function(state) {
  var ahead = core.step - state.step;
  console.log('We are ' + ahead + ' steps ahead of server. ' +
    'Local: ' + core.step + ' Server: ' + state.step);

  /*
  state.players.forEach(function(bike) {
    if(bike.userId != client.player.id) {
      var bikeToUpdate = core.getBikeById(bike.userId);

      bikeToUpdate.x = bike.x;
      bikeToUpdate.y = bike.y;
      bikeToUpdate.direction = bike.direction;
    }
  });
  */
};


canvasHelper.init = function() {
  canvas = $('#canvas')[0];
  canvas.width  = (this.blockSize * this.maxTiles.width);
  canvas.height = (this.blockSize * this.maxTiles.height);
  this.context  = canvas.getContext('2d');
};


canvasHelper.drawBike = function(bike) {
  this.context.fillRect(
    bike.x * this.blockSize,
    bike.y * this.blockSize,
    this.blockSize,
    this.blockSize
  );
};


function addInputHandlersToPlayer(player) {
  var bike = player.bike;
  $(document).keypress(function(event) {
    switch(event.which) {
      case 119: bike.changeDirection('n'); break; // W
      case 97:  bike.changeDirection('w'); break; // A
      case 115: bike.changeDirection('s'); break; // S
      case 100: bike.changeDirection('e'); break; // D
    }
  });
}


core.bike.changeDirectionClient = function(newDirection) {
  socket.emit('bikeInput', {
    direction:  newDirection,
    step:       core.step
  });
};


core.gameLoopClient = function() {
  $('#debug').text('X: ' + client.player.bike.x +
      ' Y: ' + client.player.bike.y);

  core.bikes.forEach(function(bike) {
    canvasHelper.drawBike(bike);
  });

  window.requestAnimationFrame(core.gameLoop);
};


client.init = function() {
  core.reset();
  core.gameLoop();
};


client.resetStartingPositions = function(state) {
  canvasHelper.init();

  console.log('Resetting starting positions');
  console.log(state);
  this.addOtherPlayers(state.players);
};


client.addOtherPlayers = function(bikes) {
  bikes.forEach(function(bike) {
    if(bike.userId != client.player.id) {
      enemyPlayer = Object.create(core.player);
      enemyPlayer.init(bike.userId);
    }
  });
};


client.removeOtherPlayers = function() {
  core.bikes.forEach(function(bike) {
    if(bike.userId != client.player.id) {
      core.removeBikeById(bike.userId);
    }
  });
}


$(document).ready(function() {
  establishConnection();

  $('#start_game').click(function() {
    socket.emit('startGame', {});
    client.init();
  });
});
