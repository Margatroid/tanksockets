(function(exports){
  if(typeof window === 'undefined') {
    exports.isServer = true;
  }
  else {
    exports.isClient = true;
  }

  //// Player
  exports.player = {
    bike: null
  };

  exports.player.init = function() {
    this.bike = Object.create(exports.bike);
    exports.bikes.push(this.bike);
  };

  //// Bike
  exports.bikes = [];

  exports.bike = {
    x: 0,
    y: 0,
    direction: 'e',
    color: '#000000'
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
    if((this.direction == 'n' && newDirection == 's') ||
      (this.direction == 's' && newDirection == 'n') ||
      (this.direction == 'w' && newDirection == 'e') ||
      (this.direction == 'e' && newDirection == 'w')) {
      return;
    }

    if(exports.isClient) {
      socket.emit('bikeInput', { direction: newDirection });
    }

    this.direction = newDirection;
  };

  // Shared game logic
  exports.startTime = 0;

  var step = 1;
  var updateInterval = 50;
  var endGame = false;

  exports.stopLoop = function() { endGame = true };

  exports.gameLoop = function() {
    var currentTime    = new Date() - exports.startTime;
    var nextUpdateTime = step * updateInterval;

    if(currentTime > nextUpdateTime) {
      step += 1;
      exports.bikes.forEach(function(bike) {
        bike.move();
      });
    }

    if(endGame) {
      return;
    }

    if(exports.isClient) {
      exports.bikes.forEach(function(bike) {
        canvasHelper.drawBike(bike);
      });

      window.requestAnimationFrame(exports.gameLoop);
    }
    else {
      setTimeout(exports.gameLoop, updateInterval / 2);
    }
  };

})(typeof exports === 'undefined' ? this['core'] = {} : exports);
