var pref;

function init_ui(){
  $('#player4')[0].disabled = true;
  $('#game_types a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });
  pref = new Pref;
}


function change_players_count( count ){
  $('#player4')[0].disabled = count == 3;
  pref.players_count = count;
}


function start_game(){
  var type = 1;
  var players = [
    {
      name : $('#player1').val() || 'P1'
    },{
      name : $('#player2').val() || 'P2'
    },{
      name : $('#player3').val() || 'P3'
    }
  ];

  if ( pref.players_count == 4 ) players.push({
    name : $('#player4').val() || 'P4'
  });

  pref.set_players( players );
  pref.new_game();

  show_game_space();
}


function show_game_space(){
  $('#start_settings').hide();
  for ( var i = 0, i_ln = pref.players.length; i<i_ln; i++ ){
    $('#player'+i+'_name').text( pref.players[i].name );
  }
  update_game_space();
  $('#game_place').show();
}


function update_game_space(){
  $('#shuffler').text( pref.shuffler.name );
  $('#min_bid').text( pref.min_bid );
  $('#all_pass').text( pref.in_all_pass ? 'В распасах' : 'Не в распасах' );

  prepare_game( pref.current_game );
}


function prepare_game( game ){
  prepare_game_switcher( game );
  prepare_game_results( game );
  draw_pool( 'pool', pref.players );
}


function change_game_type( type ){
  var game = pref.current_game;
  switch (type) {
    case 7:
    case 8:
    case 9:
    case 10:
      game.bid  = type;
      game.type = 'single';
      break;

    default:
      game.type = type;
  }

  prepare_game_results( game );
}


function prepare_game_switcher( game ){
  var game_type;

  if ( game.type == 'single' ) game_type = ({
    7 : 'seven',
    8 : 'eight',
    9 : 'nine',
    10 : 'ten'
  })[ game.bid ];
  else game_type = game.type;

  $('#game_types a[href="#' + game_type + '"]').tab('show');
}


function prepare_game_results( game ){
  game.set_player_tricks();

  // show current player switcher
  if ( game.type == 'all_pass' ) {
    $('#current_player').hide();
  }
  else {
    var controls = $('#current_player .controls');
    controls.empty();
    for ( var i = 0, i_ln = game.players.length; i<i_ln; i++ ){
      var player = game.players[i];
      controls.append( [
        '<button id="game_player_', player.id,'" class="btn" onclick="set_active_player(', player.id, ')">',
          player.name,
        '</button>'].join('') );
    }
    $('#game_player_' + game.player.id).button('toggle');

    $('#current_player').show();

    if ( game.type == 'single' ) update_visters( game, false );
  }

  // show visters switcher
  $('#visters')[ game.type == 'single' ? 'show' : 'hide' ]();

  update_tricks( game );
}


function set_active_player( id ){
  var game = pref.current_game;
  game.set_player( pref.get_player(id) );
  update_visters( game );
}


function update_visters( game, upd_tricks ){
  var controls = $('#visters .controls');
  controls.empty();
  for ( var i = 0, i_ln = game.players.length; i<i_ln; i++ ){
    var player = game.players[i];
    if ( player == game.player ) continue;

    controls.append( [
      '<button id="game_vister_', player.id,'" class="btn" onclick="set_vister(', player.id, ', this)">',
      player.name,
      '</button>'].join('') );
  }

  for ( i = 0, i_ln = game.visters.length; i<i_ln; i++ ){
    $('#game_vister_' + game.visters[i].id).button('toggle');
  }

  if (upd_tricks !== false) update_tricks( game );
}


function set_vister( id, el ){
  var enabled = !$(el).hasClass('active'); //статус к этому моменту не успевает смениться
  var game = pref.current_game;
  game[ enabled ? 'set_vister' : 'remove_vister' ]( pref.get_player(id) );
  update_visters( game );
}


function update_tricks( game ){
  for ( var i = 0; i<pref.players_count; i++ ){
    var el      = $('#player'+i+'_tricks');
    var player  = pref.players[i];

    if ( game.is_player_count_tricks( player )) {
      el.find('button:eq('+ game.get_player_tricks( player ) +')').button('toggle');
      el.show();
    }
    else el.hide();
  }

  // играющего ставим в начала списка, чтоб было удобнее задавать количество взяток
  if ( game.type != 'all_pass' ) {
    var pl_el = $('#player'+game.player.id+'_tricks');
    pl_el.prependTo( pl_el.parent() );
  }
}


function set_tricks( player_id, tricks ){
  var game   = pref.current_game;
  var player = pref.get_player( player_id );
  if ( game.type == 'all_pass' ) {
    var tr = {};
    tr[ player_id ] = tricks;
    game.set_player_tricks(tr);
  } else if ( game.player == player ) game.set_player_tricks( tricks );
  else {
    var tr = {};
    tr[ player_id ] = tricks;
    game.set_vister_tricks(tr);
  }

  update_tricks( game );
}


function apply_game(){
  pref.apply_game();
  update_game_space();
}