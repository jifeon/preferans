function draw_pool( id, players ){
  var ctx = $('#pool')[0].getContext('2d');

  var line   = 2;
  var width  = ctx.canvas.width;
  var height = ctx.canvas.height;

  ctx.strokeStyle = 'rgb(0,136,204)';
  ctx.fillStyle   = 'white';
  ctx.lineWidth   = line;
  ctx.fillRect(0,0,width,height);
  ctx.strokeRect(line-1, line-1, width-line-1, height-line-1);

  // линии для вистов
  ctx.beginPath();
  ctx.moveTo(width/3, 2);
  ctx.lineTo(width/3, height-2);
  ctx.moveTo(width/3*2, 2);
  ctx.lineTo(width/3*2, height-2);
  ctx.moveTo(2, height/3);
  ctx.lineTo(width-2, height/3);
  ctx.moveTo(2, height/3*2);
  ctx.lineTo(width-2, height/3*2);
  ctx.stroke();

  // пуля и гора
  ctx.fillRect(width/6, height/6, width/3*2, height/3*2);
  ctx.strokeRect(width/6, height/6, width/3*2, height/3*2);
  ctx.strokeRect(width/4, height/4, width/2, height/2);

  // диагоняли
  ctx.beginPath();

  ctx.moveTo(2, 2);
  ctx.lineTo(width-2, height-2);
  ctx.moveTo(2, height-2);
  ctx.lineTo(width-2, 2);

  // имена
  ctx.moveTo(width/2+80, height/2);
  ctx.arc(width/2, height/2, 80, 0, 360, false);

  ctx.stroke();

  // надписи
  var text_pos = {
    names : [
      [ '', width/2-16, height/2-28 ],
      [ '', width/2+26, height/2+13 ],
      [ '', width/2-16, height/2+50 ],
      [ '', width/2-58, height/2+13 ]
    ],
    heap : [
      [ '', width/2-16, height/2-108 ],
      [ '', width/2+136, height/2+13 ],
      [ '', width/2-16, height/2+130 ],
      [ '', width/2-168, height/2+13 ]
    ],
    pool : [
      [ '', width/2-16, height/2-165 ],
      [ '', width/2+266, height/2+13 ],
      [ '', width/2-16, height/2+187 ],
      [ '', width/2-298, height/2+13 ]
    ],
    vists : [
      [
        [ '', width/2+234, height/2-240 ],
        [ '', width/2-16, height/2-240 ],
        [ '', width/2-256, height/2-240 ]
      ],[
        [ '', width/2+380, height/2-150 ],
        [ '', width/2+380, height/2+163 ],
        [ '', width/2+380, height/2+13 ]
      ],[
        [ '', width/2-16, height/2+266 ],
        [ '', width/2+234, height/2+266 ],
        [ '', width/2-256, height/2+266 ]
      ],[
        [ '', width/2-396, height/2-150 ],
        [ '', width/2-396, height/2+13 ],
        [ '', width/2-396, height/2+163 ]
      ]
    ]
  }

  ctx.font = '26px sans-serif';
  ctx.fillStyle   = 'black';

  for (var i = 0; i < players.length; i++){
    var args = text_pos.names[i];
    args[0] = players[i].name.substr(0,2);
    ctx.fillText.apply( ctx, args );

    args = text_pos.heap[i];
    args[0] = players[i].heap;
    ctx.fillText.apply( ctx, args );

    args = text_pos.pool[i];
    args[0] = players[i].pool;
    ctx.fillText.apply( ctx, args );

    var p = 0;
    for (var w = 0; w < players.length; w++){
      if ( i==w ) continue;
      args = text_pos.vists[i][p];
      args[0] = players[i].vists[w];
      ctx.fillText.apply( ctx, args );
      p++;
    }
  }
}