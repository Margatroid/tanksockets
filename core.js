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

  this.onMoveCallback = function(){};

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

  this.onMoveCallback();
};

Player.prototype.setOnMoveCallback = function setOnMoveCallBack(callback) {
  this.onMoveCallback = callback;
};

function World() {
  this.tanks = [];
  this.size  = { x: 1200, y: 800 };
};

World.prototype.loop = function loop() {

};

World.prototype.loopCallback = function loopCallback() {

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


var world = new World();
