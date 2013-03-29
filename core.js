(function(exports){
  if(typeof window === 'undefined') {
  }
  else {
  }
})(typeof exports === 'undefined' ? this['core'] = {} : exports);


function Player(uuid) {
  // Private. Player UUID.
  var _uuid = uuid;
  var _hp   = 1;

  // Publicly accessible player attributes.
  this.x    = 0;
  this.y    = 0;
  this.name = _uuid;

  // Privileged method to damage this player.
  this.damage = function(damage) { _hp -= damage };
}


Player.prototype.move = function(direction) {
  newX = this.x;
  newY = this.y;

  switch(direction) {
    case 'n': newY -= 1; break;
    case 's': newY += 1; break;
    case 'w': newX -= 1; break;
    case 'e': newX += 1; break;
  }
};


function World() {
};


function Physics() {
};


function Tank(player) {
  var _player = player;
};
