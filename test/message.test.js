var helper = require('./support/helper')
  , User = require('./support/user')
  , DoneCriteria = require('./support/done-criteria');

describe('messaging', function() {
  describe('when a user is connected', function() {
    var me = new User(global.test.appUrl, { username: 'me' })
      , other = new User(global.test.appUrl, { username: 'other' });

    beforeEach(function(done) {
      me.connect(function() {
        other.connect(done);
      });
    });

    afterEach(function(done) {
      me.disconnect(function() {
        other.disconnect(done);
      });
    });

    it('notifies everyone except the sender', function(done) {
      var doneCriteria = new DoneCriteria(['me', 'other'], done);
    });

    describe('when a user sends a message', function() {
      it('sends the message to everyone except the sender')
    });
  });
});
