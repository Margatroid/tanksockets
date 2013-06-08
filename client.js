function Connection() {
  this.socket = {};
}

Connection.prototype.connect = function connect() {
  this.socket = io.connect('/');
  this.userId = {};
  var that    = this;

  this.socket.on('onNewClientConnect', function(data) {
    console.log('Connected to server. UUID: ' + data.userId);
    that.userId = data.userId;
    that.setupControls();
  });

  this.socket.on('sendTankAndWorldTo', function(data) {
    that.getTankAndWorld(data);
  });

  this.socket.on('startGameLoop', this.startGameLoop);
};

Connection.prototype.startGameLoop = function startGameLoop() {
  // Draw each tank from server.
  graphics.setupTanks();

  world.startLoop();
};

Connection.prototype.getTankAndWorld = function getTankAndWorld(data) {
  graphics.init(data.world);
  world = data.world;

  world.__proto__ = World.prototype;
  world.lastLoopTime = new Date();

  graphics.setupTanks();
};

// Graphics object.
function Graphics() {
  this.canvas  = {};
  this.pointer = { x: 0, y: 0 };
}

Connection.prototype.setupControls = function setupControls() {
  var socket = this.socket;
  $('#start').click(function(){ socket.emit('onStartButtonClick'); });
};

Graphics.prototype.init = function init(world) {
  this.canvas = new fabric.Canvas('canvas', { backgroundColor: '#EDE3BB' });
  this.canvas.setHeight(world.size.x);
  this.canvas.setWidth(world.size.y);
};

Graphics.prototype.setupTanks = function setupTanks() {
  var that = this;

  world.tanks.forEach(function(tank) {
    tank.__proto__ = Tank.prototype;

    if (connection.userId == tank.userId) {
      world.ownTank = tank;
      tank.setupControls();
    }

    that.addFabricTank(tank);
    that.canvas.add(tank.fabric);
  });

  this.canvas.renderAll();
};

Graphics.prototype.addFabricTank = function addFabricTank(tank) {
    // Shape the hull of the tank.
  var hull = new fabric.Rect({ fill: 'red', width: 20, height: 30 });

  tank.fabricGun = this.getFabricGun();

  var attributes  = { left: tank.x, top: tank.y };
  tank.fabric = new fabric.Group([ hull, tank.fabricGun ], attributes);

  this.setupTurretRotation(tank);
};

Graphics.prototype.getFabricGun = function getFabricGun() {
  // Shape gun, along with invisible counterbalance gun to allow pivoting.
  var mainGun = new fabric.Rect(
    { top: -10, width: 5, height: 20, fill: 'black' }
  );

  var mainGunCounterBalance = new fabric.Rect(
    { top: 10, height: 20, opacity: 0 }
  );

  return new fabric.Group([ mainGun, mainGunCounterBalance ]);
};

Graphics.prototype.setupTurretRotation = function(tank) {
  var pointer = this.pointer;
  var canvas  = this.canvas;

  this.canvas.on('mouse:move', function(options) {
    pointer.x = canvas.getPointer(options.e).x;
    pointer.y = canvas.getPointer(options.e).y;

    graphics.rotateTurret(tank);
  });
};

Graphics.prototype.rotateTurret = function rotateTurret(tank) {
  var radians = Math.atan2(this.pointer.y - tank.y, this.pointer.x - tank.x);
  var angle   = (radians * 180 / Math.PI) + 90;

  tank.fabricGun.rotate(angle);
  this.canvas.renderAll();
};

Graphics.prototype.moveFabricTanks = function() {
  world.tanks.forEach(function(tank) {
    tank.fabric.set({ left: tank.x, top: tank.y });
  });

  graphics.rotateTurret(world.ownTank);
};

Tank.prototype.setupControls = function setupControls() {
  var tank             = world.ownTank;
  var movementKeycodes = { 87: 'n', 65: 'w', 83: 's', 68: 'e' };
  var pressed          = { 'n': false, 'w': false, 's': false, 'e': false };

  var checkAnyMovementKeyPressed = function checkAnyMovementKeyPressed() {
    for (var key in pressed) {
      if (pressed[key]) {
        return true;
      }
    }

    return false;
  };

  var changeDirection = function changeDirection() {
    if (pressed['n'] && pressed['e']) {
      tank.direction = 'ne';
    } else if (pressed['e'] && pressed['s']) {
      tank.direction = 'se';
    } else if (pressed['s'] && pressed['w']) {
      tank.direction = 'sw';
    } else if (pressed['w'] && pressed['n']) {
      tank.direction = 'nw';
    } else {

      var getDirection = function getDirection() {
        for (var key in pressed) {
          if (pressed[key]) { return key; }
        }
        return 'n';
      };

      tank.direction = getDirection();
    }
  };

  $(document).keydown(function(event) {
    var keycode = event.which;

    // Verify keycode represents a directional key.
    if (typeof movementKeycodes[keycode] === 'string') {
      tank.isMoving                      = true;
      pressed[movementKeycodes[keycode]] = true;
      changeDirection();
    }
  });

  $(document).keyup(function(event) {
    var keycode = event.which;

    // Verify keycode represents a directional key.
    if (typeof movementKeycodes[keycode] === 'string') {
      pressed[movementKeycodes[keycode]] = false;
    }

    changeDirection();
    tank.isMoving = checkAnyMovementKeyPressed();
  });
};

World.prototype.gameLoopCallback = function gameLoopCallback() {
  // Set left and top of tanks after core has changed their coordinates.
  graphics.moveFabricTanks();
  graphics.canvas.renderAll();
};

var connection;
var graphics = new Graphics();
var world    = {};

$(document).ready(function() {
  connection = new Connection();
  connection.connect();
});
