// ClientTank object.

function ClientTank(player) {
  proto(ClientTank.prototype).constructor.call(this, player);

  this.fabricTank;
  this.fabricGun;
}

ClientTank.prototype   = Object.create(Tank.prototype);
ClientTank.constructor = ClientTank;

ClientTank.prototype.getCanvasObjectFromTank = function(tank) {
  // Shape the hull of the tank.
  var hull = new fabric.Rect({ fill: 'red', width: 20, height: 30 });

  // Shape gun, along with invisible counterbalance gun to allow pivoting.
  var mainGun = new fabric.Rect(
    { top: -10, width: 5, height: 20, fill: 'black' }
  );
  var mainGunCounterBalance = new fabric.Rect(
    { top: 10, height: 20, opacity: 0 }
  );

  this.fabricGun = new fabric.Group([ mainGun, mainGunCounterBalance ]);

  if(!tank.x && !tank.y) {
    tank.x = world.getDefaultStartingPos().x;
    tank.y = world.getDefaultStartingPos().y;
  }

  var attributes  = { left: tank.x, top: tank.y };
  this.fabricTank = new fabric.Group([ hull, this.fabricGun ], attributes);
};

ClientTank.prototype.addTankToCanvas = function(tank) {
  this.getCanvasObjectFromTank(tank);
  this.setupTurretRotation();

  graphics.canvas.add(this.fabricTank);
};

ClientTank.prototype.setupTurretRotation = function() {
  var that = this;

  graphics.canvas.on('mouse:move', function(options) {
    var pointer = graphics.canvas.getPointer(options.e);
    var radians = Math.atan2(pointer.y - that.y, pointer.x - that.x);
    var angle   = (radians * 180 / Math.PI) + 90;

    that.fabricGun.rotate(angle);
    graphics.canvas.renderAll();
  })
};

// Connection object.

function Connection() {
  this.socket = {};
}

Connection.prototype.connect = function() {
  this.socket = io.connect('/');
  this.uuid;

  this.socket.on('onconnected', function(data) {
    console.log('Connected to server. UUID: ' + data.id);
    this.uuid = data.id;

    // Temporary code to init a tank from a new player.
    graphics.init();

    var player = new Player(this.uuid);
    var tank   = new ClientTank(player);

    clientWorld.addTank(tank);
    
    tank.addTankToCanvas(tank);
  });
};

// Graphics object.

function Graphics() {
  this.canvas = {};
};


Graphics.prototype.init = function() {
  this.canvas = new fabric.Canvas('canvas', { backgroundColor: '#EDE3BB' });
};

var connection;
var proto       = Object.getPrototypeOf;
var graphics    = new Graphics();

$(document).ready(function() {
  connection = new Connection();
  connection.connect();
});
