/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	listen: function(res, res){

		User.findOne({id: 1}, function(err, user){
			if(err){
				res.json(err);
			}
			if(user){
				Slack.listen(user);
				res.json({listening: true});
			}
		});

	}

};
