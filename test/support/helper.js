var path = require('path')
  , should = require('should')
  , config = require('config');
global.test = {
    root: path.resolve(__dirname, '../')
  , appUrl: 'http://' + config.app.host + ':' + config.app.port
  , config: config
};

var RedisCleaner = require('./redis-cleaner')
  , redisCleaner = new RedisCleaner(
        config.store.host
      , config.store.port
      , config.store.prefix
    )
  , App = require('./app')
  , app = new App();

before(function(done) {
  app.start(done);
});

beforeEach(function(done) {
  redisCleaner.clean(done);
});

afterEach(function(done) {
  // put something if you have something
  done();
});

after(function(done) {
  app.shutdown(done);
});
