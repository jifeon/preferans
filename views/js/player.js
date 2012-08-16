function Player( options ){
  this.id     = options.id;
  this.name   = options.name;
  this.heap   = 0;
  this.pool   = 0;
  this.vists  = {};

  this.init_vists();
}


Player.prototype.init_vists = function(){
  for ( var i = 0; i<4; i++ ){
    if ( i != this.id ) this.vists[i] = 0;
  }
}


Player.prototype.write_pool = function( v ){
  this.pool += v;
  if ( pref.type == 'time' || this.pool <= pref.type ) return;

  var dif = this.pool - pref.type;
  this.pool = pref.type;

  var common_pool = pref.get_common_pool();
  var free_pool   = pref.type * pref.players_count - common_pool;
  var pool_to_decrease_heap = Math.max( dif - free_pool, 0 );

  if ( pool_to_decrease_heap ) this.write_heap( -pool_to_decrease_heap * 2 );
  dif -= pool_to_decrease_heap;

  if ( !dif ) return;

  var self = this;
  var players = pref.players
    .filter(function( player ){
      return player != this;
    }, this)
    .sort(function( p1, p2 ){
      var d_pool = p2.pool - p1.pool;
      if ( d_pool ) return d_pool;

      if ( p1.id < self.id && p2.id < self.id || p1.id > self.id && p2.id > self.id )
        return p2.id - p1.id;
      else
        return p1.id - p2.id;
    });

  var p = 0;
  while ( dif > 0 ) {
    var player    = players[p];
    var need_pool = Math.min( pref.type - player.pool, dif );
    dif -= need_pool;
    player.write_pool( need_pool );
    this.write_vists( need_pool*10, player );
    p++;
  }
}


Player.prototype.write_vists = function( v, player ){
  this.vists[ player.id ] += v;
}


Player.prototype.write_heap = function( v ){
  this.heap += v;
}