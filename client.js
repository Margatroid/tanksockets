// ClientWorld object.

function ClientWorld() {
  proto(ClientWorld.prototype).constructor.call(this);
}

ClientWorld.prototype   = Object.create(World.prototype);
ClientWorld.constructor = ClientWorld;

// ClientTank object.

function ClientTank(player) {
  proto(ClientTank.prototype).constructor.call(this, player);

  this.fabricTank;
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

  var gun = new fabric.Group([ mainGun, mainGunCounterBalance ]);

  if(!tank.x && !tank.y) {
    tank.x = world.getDefaultStartingPos().x;
    tank.y = world.getDefaultStartingPos().y;
  }

  var attributes  = { left: tank.x, top: tank.y };
  this.fabricTank = new fabric.Group([ hull, gun ], attributes);
};

ClientTank.prototype.addTankToCanvas = function(tank) {
  this.getCanvasObjectFromTank();
  this.setupTurretRotation();

  graphics.canvas.add(this.fabricTank());
};

// Connection object.

function Connection() {
  this.socket;
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
    
    tank.drawTank(tank);
  });
};

// Graphics object.

function Graphics() {
  this.canvas;
  /*
  var canvas = new fabric.Canvas('canvas', { backgroundColor: '#EDE3BB' });

  var hull = new fabric.Rect({
    fill: 'red',
    width: 20,
    height: 30
  });

  var mainGun = new fabric.Rect({
    top:    -10,
    width:  5,
    height: 20,
    fill:   'black'
  });

  // Invisble gun to make gun rotate on the correct pivot.
  var mainGunCounterBalance = new fabric.Rect({
    fill:    'blue',
    height:  20,
    top:     10,
    opacity: 0
  });

  var gun = new fabric.Group([ mainGun, mainGunCounterBalance ], {});

  var tank = new fabric.Group([ hull, gun ], {
    left: 600,
    top:  300
  });

  canvas.add(tank);

  canvas.on('mouse:move', function(options) {
    var pointer = canvas.getPointer(options.e);
    var angle = (Math.atan2(pointer.y - tank.top, pointer.x - tank.left)
      * 180 / Math.PI) + 90;
    gun.rotate(angle);
    canvas.renderAll();
    $('#debug').html(pointer.x + ', ' + pointer.y + '. Angle: ' + angle);
  });
  */
};


Graphics.prototype.init = function() {
  this.canvas = new fabric.Canvas('canvas', { backgroundColor: '#EDE3BB' });
};





var connection;
var proto       = Object.getPrototypeOf;
var clientWorld = new ClientWorld();
var graphics    = new Graphics();

$(document).ready(function() {
  connection = new Connection();
  connection.connect();
});
