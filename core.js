(function(exports){
  if(typeof window === 'undefined') {
  }
  else {
  }
})(typeof exports === 'undefined' ? this['core'] = {} : exports);


function Tank() {
  this.hp   = 1;
  this.x    = 0;
  this.y    = 0;
}

function World() {
  this.tanks = [];
  this.size  = { x: 1200, y: 800 };
  var self   = this;

  this.interval = setInterval(function(){ self.gameLoop(self) }, 2000);
}

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

exports.World = World;
exports.Tank  = Tank;