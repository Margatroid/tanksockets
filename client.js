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
  });
}

$(document).ready(function() {
  establishConnection();

  Graphics = new Graphics();
});


///////////////////////////////////////////////////////////////////////////////


function Graphics() {
  var canvas = new fabric.Canvas('canvas', { backgroundColor: '#EDE3BB' });

  var tank = new fabric.Rect({
    left: 600,
    top: 300,
    fill: 'red',
    width: 10,
    height: 15,
  });

  canvas.add(tank);
};
