(function(){
  var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;
})();

var socket = io.connect('/');

function establishConnection() {
  socket.on('onconnected', function(data) {
    console.log('Received UUID of ' + data.id + ' from socket.io');

    var localPlayer = Object.create(core.player);
    localPlayer.init(data.id);
    addInputHandlersToPlayer(localPlayer);
  });

  socket.on('gameState', function(state) {
    canvasHelper.processIncomingState(state);
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

function init() {
  canvasHelper.init();

  core.startTime = new Date();

  socket.emit('startGame', {});
  core.gameLoop();
}

$(document).ready(function() {
  establishConnection();

  $('#start_game').click(function() {
    init();
  });
});
