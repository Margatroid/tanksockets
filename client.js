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

var canvas;
var canvasSize = { height: 100, width: 100 }

var bike = {
  x: 0,
  y: 0,
  direction: 'e',
  color: '#000000'
};

bike.move = function()
{
  switch(this.direction)
  {
    case 'n': this.y -= 1; break;
    case 's': this.y += 1; break;
    case 'w': this.x -= 1; break;
    case 'e': this.x += 1; break;
  }
};

var canvasHelper = {
  blockSize: 5,
  maxTiles: { height: 100, width: 100 }
};

canvasHelper.init = function()
{
  canvas = $('#canvas')[0];
  canvas.width  = (this.blockSize * this.maxTiles.width);
  canvas.height = (this.blockSize * this.maxTiles.height);
  this.context  = canvas.getContext('2d');
}

canvasHelper.drawBike = function(bike)
{
  this.context.fillRect(
    bike.x * this.blockSize,
    bike.y * this.blockSize,
    this.blockSize,
    this.blockSize
  );
};


function init()
{
  canvasHelper.init();

  startTime = new Date();

  bikes.push(Object.create(bike));

  gameLoop();
}

var startTime;
var step = 1;
var updateInterval = 50;

var bikes = [];

function gameLoop()
{
  var currentTime    = new Date() - startTime;
  var nextUpdateTime = step * updateInterval;

  if(currentTime > nextUpdateTime)
  {
    step += 1;
    $.each(bikes, function(index, bike)
    {
      bike.move();
    });
  }

  $.each(bikes, function(index, bike)
  {
    canvasHelper.drawBike(bike);
  });

  window.requestAnimationFrame(gameLoop);
}

$(document).ready(function(){
  init();
});
