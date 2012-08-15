module.exports = Site.inherits( global.autodafe.Controller );

function Site(params){
  this._init(params);
}


Site.prototype.index = function( params, client ){
  this.send_response( 'index.html', client );
}