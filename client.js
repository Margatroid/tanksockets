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
  var canvas = new fabric.Canvas('canvas');
};
