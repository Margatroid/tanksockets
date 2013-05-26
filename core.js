function Tank() {
  this.hp   = 1;
  this.x    = 150;
  this.y    = 150;
}

function World() {
  this.tanks = [];
  this.size  = { x: 500, y: 500 };
  var self   = this;

  this.interval = setInterval(function(){ self.gameLoop(self); }, 2000);
}

Tank.prototype.move = function(direction) {
  switch(direction) {
    case 'n': this.y -= 1; break;
    case 's': this.y += 1; break;
    case 'w': this.x -= 1; break;
    case 'e': this.x += 1; break;
  }
};

World.prototype.addTank = function(tank) {
  this.tanks.push(tank);
};

World.prototype.gameLoop = function(self) {
  // Run loop code specific to client or server.
  self.gameLoopCallback();
};

World.prototype.gameLoopCallback = function gameLoopCallback(){};

World.prototype.removeTankByUserId = function removeTankByUserId(userId) {
  for (var index in this.tanks) {
    if (this.tanks[index].userId == userId) {
      delete this.tanks[index];
    }
  }

  // Empty array of empty elements.
  this.tanks = this.tanks.filter(function(n){ return n; });
};

(function(exports){
  if(typeof window === 'undefined') {
    exports.World = World;
    exports.Tank  = Tank;
  }
})(typeof exports === 'undefined' ? this['core'] = {} : exports);