(function(){
  var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;
})();

var socket = io.connect('/');
socket.on('onconnected', function(data) {
  console.log('Received UUID of ' + data.id + ' from socket.io');
});

var canvasHelper = {
  blockSize: 5,
  maxTiles: { height: 100, width: 100 }
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


var startTime;
var step = 1;
var updateInterval = 50;

var bikes = [];

function gameLoop() {
  var currentTime    = new Date() - startTime;
  var nextUpdateTime = step * updateInterval;

  if(currentTime > nextUpdateTime) {
    step += 1;
    $.each(bikes, function(index, bike) {
      bike.move();
    });
  }

  $.each(bikes, function(index, bike) {
    canvasHelper.drawBike(bike);
  });

  window.requestAnimationFrame(gameLoop);
}

var player = {
  bike: null
};

player.init = function() {
  this.bike = Object.create(core.bike);
  bikes.push(this.bike);

  this.addInputHandlers();
};

player.addInputHandlers = function() {
  var bike = this.bike;
  $(document).keypress(function(event) {
    switch(event.which) {
      case 119: bike.changeDirection('n'); break;
      case 97:  bike.changeDirection('w'); break;
      case 115: bike.changeDirection('s'); break;
      case 100: bike.changeDirection('e'); break;
    }
  });
};

function init() {
  canvasHelper.init();

  startTime = new Date();

  var localPlayer = Object.create(player);
  localPlayer.init();

  gameLoop();
}

$(document).ready(function() {
  init();
});
