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
  this.interval = setInterval(function(){ self.gameLoop(self); }, 1000);
};

World.prototype.addTank = function(tank) {
  this.tanks.push(tank);
};

World.prototype.gameLoop = function(self) {
  self.moveTanks(self);

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
      console.log('new Date() = ' + new Date());
      console.log('self.lastLoopTime = ' + self.lastLoopTime);
      console.log('self.lastLoopTime: ' + Math.abs(new Date() - self.lastLoopTime.getTime()));
      switch (tank.direction) {
        case 'n': tank.y -= distance; break;
        case 's': tank.y += distance; break;
        case 'w': tank.x -= distance; break;
        case 'e': tank.x += distance; break;
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