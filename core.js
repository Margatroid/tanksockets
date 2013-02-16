(function(exports){
  exports.test = function() {
    return 'hello world';
  };

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

    this.direction = newDirection;
  };
})(typeof exports === 'undefined' ? this['core'] = {} : exports);
