function Tank() {
  this.hp        = 1;
  this.x         = 150;
  this.y         = 150;
  this.direction = 'n';
  this.isMoving  = false;
  this.world     = {};
}

function World() {
  this.tanks = [];
  this.size  = { x: 500, y: 500 };

  this.lastLoopTime = new Date();
}

function Vector(components) {
  this.components = components;
}

World.prototype.startLoop = function startLoop() {
  var self      = this;
  this.interval = setInterval(function(){ self.gameLoop(self); }, 20);
};

World.prototype.addTank = function(tank) {
  this.tanks.push(tank);
};

World.prototype.gameLoop = function(self) {
  self.moveTanks(self);
  self.lastLoopTime = new Date();

  // Run loop code specific to client or server.
  self.gameLoopCallback();
};

World.prototype.gameLoopCallback = function gameLoopCallback(){};

World.prototype.moveTanks = function moveTanks(self) {
  var tanks = self.tanks;

  tanks.forEach(function(tank) {
    if (tank.isMoving) {
      tank.move(self.lastLoopTime);
    }
  });
};

Tank.prototype.move = function move(lastLoopTime) {
  /*
  var speed    = 50;
  var distance = speed * ((new Date() - lastLoopTime) / 1000);

  switch (this.direction) {
    case 'n':  this.y -= distance; break;
    case 'ne': this.x += distance / 2; this.y -= distance / 2; break;
    case 'nw': this.x -= distance; this.y -= distance; break;
    case 's':  this.y += distance; break;
    case 'se': this.x += distance; this.y += distance; break;
    case 'sw': this.x -= distance; this.y += distance; break;
    case 'w':  this.x -= distance; break;
    case 'e':  this.x += distance; break;
  }*/
  var velocity = [0, 1]; // [X, Y]. Default to east.
  switch (this.direction) {
    case 'n':  velocity = [ 0, -1]; break;
    case 'ne': velocity = [ 1, -1]; break;
    case 'nw': velocity = [-1, -1]; break;
    case 's':  velocity = [ 0,  1]; break;
    case 'se': velocity = [ 1,  1]; break;
    case 'sw': velocity = [-1,  1]; break;
    case 'w':  velocity = [-1,  0]; break;
  }

  console.log([this.x, this.y]);
  var result = new Vector([this.x, this.y]).add(new Vector(velocity));
  console.log(result.components);
  this.x = result.components[0];
  this.y = result.components[1];
};

World.prototype.removeTankByUserId = function removeTankByUserId(userId) {
  for (var index in this.tanks) {
    if (this.tanks[index].userId == userId) {
      delete this.tanks[index];
    }
  }

  // Empty array of empty elements.
  this.tanks = this.tanks.filter(function(n){ return n; });
};

Vector.prototype.add = function add(vector) {
  console.log('THIS COMPONENTS');
  console.log(this.components);
  var result = [];
  for (var i = 0; i < vector.components.length; i++) {
    result.push(this.components[i] + vector.components[i]);
  }
  console.log('Finished adding vector yo');
  console.log(result);
  return new Vector(result);
};

(function(exports){
  if(typeof window === 'undefined') {
    exports.World = World;
    exports.Tank  = Tank;
  }
})(typeof exports === 'undefined' ? this['core'] = {} : exports);