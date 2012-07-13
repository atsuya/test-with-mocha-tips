var path = require('path')
  , assert = require('assert')
  , should = require('should')
  , config = require('config');

var RedisCleaner = require('./redis-cleaner')
  , redisCleaner = new RedisCleaner(
        config.store.host
      , config.store.port
      , config.store.prefix
    )
  , App = require('./app')
  , app = new App();

global.test = {
    root: path.resolve(__dirname, '../')
  , config: config
  , appUrl: 'http://' + config.app.host + ':' + config.app.port
};

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

module.exports = {
    assert: assert
  , should: should
};
