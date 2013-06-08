function Tank() {
  this.hp        = 1;
  this.x         = 150;
  this.y         = 150;
  this.direction = 'n';
  this.isMoving  = false;
}

function World() {
  this.tanks = [];
  this.size  = { x: 500, y: 500 };

  this.lastLoopTime = new Date();
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
      var speed    = 50;
      var distance = speed * ((new Date() - self.lastLoopTime) / 1000);
      switch (tank.direction) {
        case 'n':  tank.y -= distance; break;
        case 'ne': tank.x += distance / 2; tank.y -= distance / 2; break;
        case 'nw': tank.x -= distance; tank.y -= distance; break;
        case 's':  tank.y += distance; break;
        case 'se': tank.x += distance; tank.y += distance; break;
        case 'sw': tank.x -= distance; tank.y += distance; break;
        case 'w':  tank.x -= distance; break;
        case 'e':  tank.x += distance; break;
      }
    }
  });
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

(function(exports){
  if(typeof window === 'undefined') {
    exports.World = World;
    exports.Tank  = Tank;
  }
})(typeof exports === 'undefined' ? this['core'] = {} : exports);