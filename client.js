function Connection() {
  this.socket = {};
}

Connection.prototype.connect = function connect() {
  this.socket = io.connect('/');
  this.userId = {};
  var that    = this;

  this.socket.on('onNewClientConnect', function(data) {
    console.log('Connected to server. UUID: ' + data.userId);
    this.userId = data.userId;
  });

  this.socket.on('sendTankAndWorldTo', function(data) {
    that.getTankAndWorld(data);
  });

  this.socket.on('announceTanksToClients', function(data) {});
};

Connection.prototype.getTankAndWorld = function getTankAndWorld(data) {
  console.log('Getting tank and world from server...');
  graphics.init(data.world);
};

// Graphics object.

function Graphics() {
  this.canvas = {};
}

Graphics.prototype.init = function init(world) {
  this.canvas = new fabric.Canvas('canvas', { backgroundColor: '#EDE3BB' });
  $(this.canvas.getElement()).width(world.size.x).height(world.size.y);

  this.canvas.renderAll();
};

Graphics.prototype.addFabricTank = function addFabricTank(tank) {
    // Shape the hull of the tank.
  var hull = new fabric.Rect({ fill: 'red', width: 20, height: 30 });

  tank.fabricGun = this.getFabricGun();

  var attributes  = { left: tank.x, top: tank.y };
  tank.fabric = fabric.Group([ hull, tank.fabricGun ], attributes);
};

Graphics.prototype.getFabricGun = function getFabricGun() {
  // Shape gun, along with invisible counterbalance gun to allow pivoting.
  var mainGun = new fabric.Rect(
    { top: -10, width: 5, height: 20, fill: 'black' }
  );

  var mainGunCounterBalance = new fabric.Rect(
    { top: 10, height: 20, opacity: 0 }
  );

  return fabric.Group([ mainGun, mainGunCounterBalance ]);
};

Graphics.prototype.setupTurretRotation = function(tank) {
  this.canvas.on('mouse:move', function(options) {
    var pointer = graphics.canvas.getPointer(options.e);
    var radians = Math.atan2(pointer.y - that.y, pointer.x - that.x);
    var angle   = (radians * 180 / Math.PI) + 90;

    tank.fabricGun.rotate(angle);
    graphics.canvas.renderAll();
  });
};

var connection;
var proto    = Object.getPrototypeOf;
var graphics = new Graphics();

$(document).ready(function() {
  connection = new Connection();
  connection.connect();
});
