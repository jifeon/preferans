module.exports = {
  name      : 'pref',
  base_dir  : __dirname,

  views_folder : 'views/templates',
  cache_views  : false,

  router    : {
    rules : {
      '/' : 'site.index'
    }
  },
  preload_components: ['log_router'],
  components : {
    http                : {
      port            : 3000,
      root_folders    : {
        js       : 'views/js',
        css      : 'views/css',
        assets   : 'views/bootstrap/docs/assets'
      }
    },

    log_router          : {
      routes : {
        console : {
          levels : [ 'trace', 'info', 'warning', 'error' ]
        }
      }
    }
  }
}