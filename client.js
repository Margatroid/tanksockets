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

  socket.on('bikesBeforeStart', function(bikes) {
    client.resetStartingPositions(bikes);
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
  maxTiles: { height: 180, width: 350 }
};


canvasHelper.processIncomingState = function(state) {
  console.log(state);
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
  core.bikes.forEach(function(bike) {
    canvasHelper.drawBike(bike);
  });

  window.requestAnimationFrame(core.gameLoop);
};


client.init = function() {
  core.reset();
  core.gameLoop();
};


client.resetStartingPositions = function(bikes) {
  canvasHelper.init();

  console.log('Resetting starting positions');
  console.log(bikes);
};


$(document).ready(function() {
  establishConnection();

  $('#start_game').click(function() {
    socket.emit('startGame', {});
    client.init();
  });
});
