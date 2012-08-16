function Game( options ){
  /**
   * 'single', 'all_pass', 'misere'
   *
   * @type {*|String}
   */
  this.type    = options.type;
  this.pref    = options.pref;

  this.bid     = this.pref.min_bid;
  this.players = this.pref.get_players_in_game();
  this.player  = null;
  this.visters = [];
  this.tricks  = {};

  this.set_player( this.players[0] );
}


Game.prototype.set_player = function( player ){
  this.player  = player;
  this.visters = [ this.players[0] == this.player ? this.players[1] : this.players[0] ];
  this.set_player_tricks();
}


Game.prototype.set_vister = function( player ){
  if ( this.is_player_in_visters(player) ) return false;

  this.visters.push( player );
  this.set_vister_tricks();
}


Game.prototype.remove_vister = function( player ){
  this.visters = this.visters.filter(function( vister ){
    return vister != player;
  });
  this.set_vister_tricks();
}


Game.prototype.is_player_count_tricks = function( player ){
  switch ( this.type ){
    case 'single':
      if ( player == this.player || this.is_player_in_visters(player) ) return true;
      break;

    case 'all_pass':
      return true;
      break;

    case 'misere':
      if ( player == this.player ) return true;
      break;
  }

  return false;
}


Game.prototype.is_player_in_visters = function( player ){
  return ~this.visters.indexOf( player );
}


Game.prototype.set_player_tricks = function( tricks ){
  if ( !tricks ) switch( this.type ) {
    case 'single':
      // по умолчанию считается что играющий набрал необходимое количество взяток
      // кроме случая когда он играет восьмирную при восьмирном выходе :)
      if ( this.bid != 8 || this.pref.min_bid == 7 ) tricks = this.bid;
      else tricks = 7;
      break;

    case 'all_pass':
      this.tricks[ this.players[0].id ] = 3;
      this.tricks[ this.players[1].id ] = 3;
      if ( this.pref.players_count == 3 )
        this.tricks[ this.players[2].id ] = 4;
      else {
        this.tricks[ this.players[2].id ] = 3;
        this.tricks[ this.pref.shuffler.id ] = 1;
      }
      break;

    case 'misere':
      tricks = 0;
      break;
  }
  else if ( this.type == 'all_pass' ) {
    for ( var id in tricks ){
      this.tricks[ id ] = tricks[ id ];
    }
  }

  if ( this.type != 'all_pass' ) {
    this.tricks[ this.player.id ] = tricks;
    this.set_vister_tricks();
  }
}


Game.prototype.get_player_tricks = function( player ){
  return this.tricks[ (player || this.player).id ] || 0;
}


Game.prototype.set_vister_tricks = function( tricks ){
  if ( this.type != 'single' ) return;

  var free_tricks = 10 - this.get_player_tricks();
  switch( this.visters.length ) {
    case 0:
      return;

    case 1:
      var vid = this.visters[0].id;
      if ( tricks && tricks[vid] ) {
        this.tricks[ vid ] = tricks[vid];
        this.tricks[ this.player.id ] = 10 - tricks[vid];
      }
      else
        this.tricks[ vid ] = free_tricks;
      break;

    case 2:
      var vid0 = this.visters[0].id;
      var vid1 = this.visters[1].id;

      if ( !tricks ) {
        this.tricks[ vid0 ] = Math.ceil( free_tricks/2 );
        this.tricks[ vid1 ] = Math.floor( free_tricks/2 );
      }
      else {
        if ( vid0 in tricks ) {
          this.tricks[ vid0 ] = tricks[ vid0 ];
          this.tricks[ vid1 ] = 10 - tricks[ this.player.id ] - tricks[ vid0 ];
        }
        else {
          this.tricks[ vid1 ] = tricks[ vid1 ];
          this.tricks[ vid0 ] = 10 - tricks[ this.player.id ] - tricks[ vid1 ];
        }
      }
      break;
  }
}


Game.prototype.apply = function(){
  switch( this.type ) {
    case 'single':
      this.apply_single();
      break;

    case 'all_pass':
      this.apply_all_pass();
      break;

    case 'misere':
      this.apply_misere();
      break;
  }
}


Game.prototype.apply_single = function(){
  var value  = (this.bid - 5) * 2;
  var tricks = this.get_player_tricks();
  if ( tricks >= this.bid ) {
    this.player.write_pool( value );

    this.visters.forEach(function( vister ){
      var vister_tricks = this.get_player_tricks( vister );
      vister.write_vists( vister_tricks * value, this.player );

      // possible shortfall
      var visters_count = this.visters.length;
      if ( tricks >= 9 ) {
        if ( this.bid <= 8 && (!vister_tricks || vister_tricks == 1 && visters_count == 1 ))
          vister.write_heap( (2/visters_count-vister_tricks) * value );
        if ( this.bid >= 9 && !vister_tricks )
          vister.write_heap( value );

      }
    }, this);

    pref.in_all_pass = false;
    pref.min_bid     = 7;
  }
  else {
    var dif = this.bid - tricks;
    this.player.write_heap( value * dif );
    this.pref.players.forEach(function( player ){
      if (player != this.player) player.write_vists( (this.get_player_tricks( player ) + dif) * value, this.player );
    }, this);
  }
}


Game.prototype.apply_all_pass = function(){
  var value  = (this.bid - 5) * 2;
  for ( var id in this.tricks ){
    var player = this.pref.get_player( id );
    player.write_heap( this.tricks[ id ] * value );
  }

  if ( !pref.in_all_pass ) {
    pref.in_all_pass = true;
    pref.min_bid     = 8;
  }
  else {
    pref.min_bid     = 7;
  }
}


Game.prototype.apply_misere = function(){
  var tricks = this.get_player_tricks();
  if ( !tricks ) this.player.write_pool( 10 );
  else this.player.write_heap( tricks * 10 );
}