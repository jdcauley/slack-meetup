var passport = require('passport'),
    SlackStrategy = require('passport-slack').Strategy;


// helper functions
function findById(id, fn) {
  User.findOne(id).exec( function(err, user){
    if (err){
      return fn(null, null);
    }else{
      return fn(null, user);
    }
  });
}

function findByUsername(u, fn) {
  User.findOne({
    username: u,
    activated: true
  }).exec(function(err, user) {
    // Error handling
    if (err) {
      return fn(null, null);
    // The User was found successfully!
    }else{
      return fn(null, user);
    }
  });
}

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new SlackStrategy(sails.config.secrets.slack,
  function(accessToken, refreshToken, profile, done) {

    User.findOrCreate({slackUser: profile.id}, {slackToken: accessToken, slackUser: profile.id, slackProfile: profile}, function(err, user){
       if(err){
        return done(err);
      }
      if(user){
        return done(null, user);
      }
    });
  }
));


/**
 * Login Required middleware.
 */

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */

exports.isAuthorized = function(req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];
  if (_.findWhere(req.user.tokens, { kind: provider })) next();
  else res.redirect('/auth/' + provider);
};
