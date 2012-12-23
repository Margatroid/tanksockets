var express = require('express');
var io      = require('socket.io');
var uuid    = require('node-uuid');
var app     = express();

app.get('/', function(req, res){
  res.send('Hello World');
});

app.listen(3000);

console.log('Listening');
