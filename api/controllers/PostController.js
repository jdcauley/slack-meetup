/**
 * PostController
 *
 * @description :: Server-side logic for managing Posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function(req, res){

    Post.find().exec(function(err, posts){

      if(posts){
        res.view({
          posts: posts
        });
      }
    });
  }

};
