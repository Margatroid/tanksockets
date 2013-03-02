(function(exports){
  if(typeof window === 'undefined') {
    exports.isServer = true;
  }
  else {
    exports.isClient = true;
  }


  //// Player - TODO: Check if null really is neccessary.
  exports.player = {
    bike:   null,
    id:     null,
    socket: null
  };


  exports.player.init = function(userId) {
    this.id   = userId;
    this.bike = Object.create(exports.bike);
    this.bike.player = this;
    exports.bikes.push(this.bike);
  };


  //// Bike
  exports.bikes = [];


  exports.bike = {
    x: 0,
    y: 0,
    direction: 'e',
    color: '#000000',
    player: null
  };


  exports.bike.move = function() {
    switch(this.direction) {
      case 'n': this.y -= 1; break;
      case 's': this.y += 1; break;
      case 'w': this.x -= 1; break;
      case 'e': this.x += 1; break;
    }
  };


  exports.bike.changeDirection = function(newDirection) {
    console.log('Changing to ' + newDirection + ' at X: ' + this.x + ', ' + this.y);
    if((this.direction == 'n' && newDirection == 's') ||
      (this.direction == 's' && newDirection == 'n') ||
      (this.direction == 'w' && newDirection == 'e') ||
      (this.direction == 'e' && newDirection == 'w')) {
      return;
    }

    if(exports.isClient) {
      this.changeDirectionClient(newDirection);
    }

    this.direction = newDirection;
  };


  // Shared game logic
  exports.startTime = 0;
  exports.step      = 1;

  var updateInterval = 50;
  var endGame = false;


  exports.endCurrentGame = function() { endGame = true };


  exports.reset = function() {
    this.startTime  = new Date();
    this.step       = 1;
    endGame         = false;
  };


  exports.gameLoop = function() {
    var currentTime    = new Date() - exports.startTime;
    var nextUpdateTime = exports.step * updateInterval;

    if(currentTime > nextUpdateTime) {
      exports.step += 1;
      exports.bikes.forEach(function(bike) {
        bike.move();
      });
    }

    if(endGame) {
      return;
    }

    // @TODO Move these to new methods in server.js and client.js
    if(exports.isClient) {
      exports.gameLoopClient();
    }
    else {
      serverCore.updateClientsGameLoop();
      setTimeout(exports.gameLoop, updateInterval / 2);
    }
  };


  exports.getBikeById = function(id) {
    for(var bike in this.bikes) {
      if(this.bikes[bike].player.id == id) {
        return this.bikes[bike];
      }
    }
  };


  exports.removeBikeById = function(id) {
    // TODO: Find a better way to do this.
    for(var bike in this.bikes) {
      if(this.bikes[bike].player.id == id) {
        delete this.bikes[bike];
      }
    }

    this.bikes = this.bikes.filter(function() { return true; });
  };


})(typeof exports === 'undefined' ? this['core'] = {} : exports);
