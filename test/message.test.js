var helper = require('./support/helper')
  , User = require('./support/user')
  , DoneCriteria = require('./support/done-criteria')
  , DataStore = require(global.test.root + '/../lib/data-store');

describe('messaging', function() {
  describe('when a user is connected', function() {
    var dataStore = new DataStore(
          global.test.config.store.host
        , global.test.config.store.port
        , global.test.config.store.prefix
      )
      , me = new User(global.test.appUrl, { username: 'me' })
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

    it('saves the username to data store', function(done) {
      var doneCriteria = new DoneCriteria(['me', 'other'], done);

      dataStore.isUserLoggedIn(me.data.username, function(error, result) {
        result.should.be.true;
        doneCriteria.done('me');
      });
      dataStore.isUserLoggedIn(other.data.username, function(error, result) {
        result.should.be.true;
        doneCriteria.done('other');
      });
    });

    describe('when a user sends a message', function() {
      it('sends the message to everyone except the sender', function(done) {
        var doneCriteria = new DoneCriteria(
                ['me.sent', 'me.received', 'other.sent', 'other.received']
              , done
            )
          , messageMe = {
                from: me.data.username
              , message: 'hello from ' + me.data.username
            }
          , messageOther = {
                from: other.data.username
              , message: 'hello from ' + other.data.username
            };

        me.connection.on('user.messageReceived', function(data) {
          data.from.should.eql(messageOther.from);
          data.message.should.eql(messageOther.message);
          doneCriteria.done('me.received');
        });
        other.connection.on('user.messageReceived', function(data) {
          data.from.should.eql(messageMe.from);
          data.message.should.eql(messageMe.message);
          doneCriteria.done('other.received');
        });

        me.sendMessage(messageMe, function(error) {
          helper.should.not.exist(error);
          doneCriteria.done('me.sent');
        });
        other.sendMessage(messageOther, function(error) {
          helper.should.not.exist(error);
          doneCriteria.done('other.sent');
        });
      });
    });
  });
});
