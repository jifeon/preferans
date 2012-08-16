function Pref( options ){
  this.players_count  = 3;
  this.current_game   = null;
  this.in_all_pass    = false;
  this.players  = [];
  this.type     = 11;
  this.shuffler = null;
  this.min_bid  = 7;
  this.games    = [];
}


Pref.prototype.set_players = function( players ){
  for ( var i = 0, i_ln = players.length; i<i_ln; i++ ){
    players[i].id = i;
    this.players.push( new Player( players[i] ));
  }

  this.players_count = this.players.length;
  this.shuffler      = this.players[0];
}


Pref.prototype.new_game = function(){
  this.current_game = new Game({
    pref : this,
    type : 'single'
  });

  this.games.push( this.current_game );
}


Pref.prototype.get_players_in_game = function(){
  return this.players_count == 3 ? this.players : this.players.filter(function( player ){
    return player != this.shuffler;
  }, this);
}


Pref.prototype.get_player = function( id ){
  return this.players[id];
}


Pref.prototype.apply_game = function(){
  this.current_game.apply();
  this.shuffler = this.players[ (this.shuffler.id + 1) % this.players_count ];
  this.new_game();
}


Pref.prototype.get_common_pool = function(){
  return this.players.reduce(function( s, p ){
    return s + p.pool;
  }, 0);
}