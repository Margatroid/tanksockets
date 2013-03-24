(function(exports){
  if(typeof window === 'undefined') {
  }
  else {
  }
})(typeof exports === 'undefined' ? this['core'] = {} : exports);


function Player(uuid) {
  // Private. Player UUID.
  var _uuid = uuid;

  // Publicly accessible player attributes.
  this.x    = 0;
  this.y    = 0;
  this.name = _uuid;
}

