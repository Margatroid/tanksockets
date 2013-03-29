(function(exports){
  if(typeof window === 'undefined') {
  }
  else {
  }
})(typeof exports === 'undefined' ? this['core'] = {} : exports);


function Player(uuid) {
  this.uuid = uuid;
  this.hp   = 1;
  this.name = uuid;

  this.damage = function(damage) { hp -= damage };
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
  this.tanks = [];
};


World.prototype.addTank = function(tank) {
  this.tanks.push(tank);
};


World.prototype.getDefaultStartingPos = function() {
  return { x: 600, y: 300 };
};


function Physics() {
};


function Tank(player) {
  this.player = player;
  this.x      = 0;
  this.y      = 0;
};


