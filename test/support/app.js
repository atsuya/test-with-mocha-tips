function App() {
  this.app;
}

App.prototype.start = function(callback) {
  this.app = require(global.test.root + '/../app.js');
  // this is pretty nasty hack
  setTimeout(function() { return callback(null); }, 500);
};

App.prototype.shutdown = function(callback) {
  this.app.close();
  return callback(null);
};

module.exports = App;
