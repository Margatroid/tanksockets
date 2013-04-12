(function(exports){
  if(typeof window === 'undefined') {
  }
  else {
  }
})(typeof exports === 'undefined' ? this['core'] = {} : exports);

function Player(uuid) {
  this.uuid      = uuid;
  this.hp        = 1;
  this.name      = uuid;
  this.isMoving  = false;
  this.direction = 'n';
  this.tank      = null;

  this.onMoveCallback = function(){};

  this.damage = function(damage) { hp -= damage; };
}


Player.prototype.move = function() {
  if(!this.isMoving) {
    return;
  }

  switch(this.direction) {
    case 'n': this.tank.y -= 1; break;
    case 's': this.tank.y += 1; break;
    case 'w': this.tank.x -= 1; break;
    case 'e': this.tank.x += 1; break;
  }

  this.onMoveCallback();
};

Player.prototype.setOnMoveCallback = function setOnMoveCallBack(callback) {
  this.onMoveCallback = callback;
};

Player.prototype.movementIntent = function movementIntent(direction, isMoving) {
  this.isMoving  = isMoving;
  this.direction = direction;

  this.movementIntentClient();
};

Player.prototype.movementIntentClient = function (direction, isMoving) {};

function World() {
  this.tanks = [];
  this.size  = { x: 1200, y: 800 };

  this.time              = new Date();
  this.lastIterationTime = 0;

  this.loop();
};

World.prototype.loop = function loop() {
  var updateInterval = 500;

  var that = this;
  var callback = function() {
    that.loopCallback();
    that.loop();
  };

  setTimeout(callback, updateInterval);
};

World.prototype.loopCallback = function loopCallback() {
  if(this.time > this.lastIterationTime + 10) {
    this.tanks.forEach(function(tank) {
      tank.player.move();
    });
  }
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

  player.tank = this;
};


var world = new World();

exports.Player  = Player;
exports.World   = World;
exports.Physics = Physics;
exports.Tank    = Tank;