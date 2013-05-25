// ClientTank object.

function ClientTank(player) {
  proto(ClientTank.prototype).constructor.call(this, player);

  this.fabricTank;
  this.fabricGun;
}

ClientTank.prototype   = Object.create(Tank.prototype);
ClientTank.constructor = ClientTank;

ClientTank.prototype.getCanvasObjectFromTank = function(tank) {

};

ClientTank.prototype.addTankToCanvas = function(tank) {
  this.getCanvasObjectFromTank(tank);
  this.setupTurretRotation();

  graphics.canvas.add(this.fabricTank);
};

// Connection object.

function Connection() {
  this.socket = {};
}

Connection.prototype.connect = function() {
  this.socket = io.connect('/');
  this.userId = {};

  this.socket.on('onconnected', function(data) {
    console.log('Connected to server. UUID: ' + data.userId);
    this.userId = data.userId;

    /*
    // Temporary code to init a tank from a new player.
    graphics.init();

    var player = new Player(this.uuid);
    var tank   = new ClientTank(player);

    clientWorld.addTank(tank);
    
    tank.addTankToCanvas(tank);
    */
  });

  this.socket.on('announceTanksToClients', function(data) {
    console.log(data);
  });

  this.socket.on('')
};

// Graphics object.

function Graphics() {
  this.canvas = {};
}

Graphics.prototype.init = function init() {
  this.canvas = new fabric.Canvas('canvas', { backgroundColor: '#EDE3BB' });
};

Graphics.prototype.addFabricTank = function addFabricTank(tank) {
    // Shape the hull of the tank.
  var hull = new fabric.Rect({ fill: 'red', width: 20, height: 30 });

  tank.fabricGun = this.getFabricGun();

  var attributes  = { left: tank.x, top: tank.y };
  tank.fabric = fabric.Group([ hull, tank.fabricGun ], attributes);
}

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
