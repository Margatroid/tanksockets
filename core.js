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
}

World.prototype.addTank = function(tank) {
  this.tanks.push(tank);
};

World.prototype.getDefaultStartingPos = function() {
  return { x: 600, y: 300 };
};

exports.World = World;