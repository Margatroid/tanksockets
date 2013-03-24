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

  var hull = new fabric.Rect({
    fill: 'red',
    width: 20,
    height: 30
  });

  var mainGun = new fabric.Rect({
    top:    -10,
    width:  5,
    height: 20,
    fill:   'black'
  });

  // Invisble gun to make gun rotate on the correct pivot.
  var mainGunCounterBalance = new fabric.Rect({
    fill:    'blue',
    height:  20,
    top:     10,
    opacity: 0
  });

  var gun = new fabric.Group([ mainGun, mainGunCounterBalance ], {});

  var tank = new fabric.Group([ hull, gun ], {
    left: 600,
    top:  300
  });

  canvas.add(tank);

  canvas.on('mouse:move', function(options) {
    var pointer = canvas.getPointer(options.e);
    $('#debug').html(pointer.x + ', ' + pointer.y);
  });
};
