/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {

	slack: function(req, res){

		passport.authorize('slack', { failureRedirect: '/failed' }, function(err, user, info){

      if ((err) || (!user)) {

        console.log(err);
        req.flash("message", '<div class="alert alert-danger">There was an error</div>');
            res.redirect('/');
				return;

      } else {

        req.logIn(user, function(err){
          if (err) {
            req.flash("message", '<div class="alert alert-danger">There was an error</div>');
            res.redirect('/');
          } else {

            res.redirect('/hook');
						return;

          }

        });

      }

    })(req, res);

	}

};
