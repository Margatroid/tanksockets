var socket = io.connect('/');
socket.on('onconnected', function(data) {
  console.log('Received UUID of ' + data.id + ' from socket.io');
});
