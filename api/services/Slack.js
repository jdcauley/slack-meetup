var Slack = require('slack');

module.exports = {

  listen: function(){

    var bot = Slack.rtm.client()
    var token = sails.config.secrets.slack.token;

    // logs: ws, started, close, listen, etc... in addition to the RTM event handler methods
    console.log(Object.keys(bot))

    // do something with the rtm.start payload
    bot.started(function(payload) {
      // console.log('payload from rtm.start', payload)
    });

    // respond to a user_typing message
    // bot.user_typing(function(msg) {
    //   console.log('several people are coding', msg);
    // });

    bot.file_shared(function(msg){
      console.log(msg);
      Slack.files.info({token: token, file: msg.file.id}, function(err, file){
          if(err){
            console.log(err);
          }
          if(file){
            console.log(file);
            Post.findOne({fileId: msg.file.id}, function(err, post){
              if(err){
                console.log(err);
              }
              if(post){
                Post.update(post.id, {
                  channel: msg.channel,
                  postContent: file.file.content_html,
                  postExcerpt: file.file.preview,
                  postTitle: file.file.title,
                  author: file.file.user,
                  editor: file.file.editor,
                  lastEditor: file.last_editor,
                  fileId: msg.file.id,
                  slug: file.file.name,
                  fileData: file.file,
                  messageData: msg
                }, function(err, update){
                  if(err){
                    console.log(err);
                  }
                  if(update){
                    Slack.chat.postMessage({token: token, channel: msg.channel, text: 'Post Updated'}, function(err, done){
                      if(err){
                        console.log(err);
                      }
                    })
                  }
                });
              } else {
                Post.create({
                  channel: msg.channel,
                  postContent: file.file.content_html,
                  postExcerpt: file.file.preview,
                  postTitle: file.file.title,
                  author: file.file.user,
                  editor: file.file.editor,
                  lastEditor: file.file.last_editor,
                  fileId: msg.file.id,
                  slug: file.file.name,
                  fileData: file.file,
                  messageData: msg
                }, function(err, newPost){
                  if(err){
                    console.log(err);
                  }
                });
              }
            });

          }
        });

    });

    bot.file_change(function(msg){

      console.log(msg);

      Slack.files.info({token: token, file: msg.file.id}, function(err, file){
          if(err){
            console.log(err);
          }
          if(file){
            console.log(file);
            Post.findOne({fileId: msg.file.id}, function(err, post){
              if(err){
                console.log(err);
              }
              if(post){
                Post.update(post.id, {
                  postContent: file.file.content_html,
                  postExcerpt: file.file.preview,
                  postTitle: file.file.title,
                  author: file.file.user,
                  editor: file.file.editor,
                  lastEditor: file.last_editor,
                  fileId: msg.file.id,
                  slug: file.file.name,
                  fileData: file.file,
                  messageData: msg
                }, function(err, update){
                  if(err){
                    console.log(err);
                  }
                  if(update){
                    Slack.chat.postMessage({token: token, channel: update.channel, text: 'Post Updated'}, function(err, done){
                      if(err){
                        console.log(err);
                      }
                    })
                  }
                });
              } else {
                Post.create({
                  postContent: file.file.content_html,
                  postExcerpt: file.file.preview,
                  postTitle: file.file.title,
                  author: file.file.user,
                  editor: file.file.editor,
                  lastEditor: file.file.last_editor,
                  fileId: msg.file.id,
                  slug: file.file.name,
                  fileData: file.file,
                  messageData: msg
                }, function(err, newPost){
                  if(err){
                    console.log(err);
                  }
                });
              }
            });

          }
        });

    });


    bot.message(function(msg){
      console.log('=============');
      console.log(msg);
      console.log('=============');

      // if( (msg.subtype === 'file_share') && (msg.file.pretty_type === 'Post' ) ){
      //
      //   Slack.files.info({token: token, file: msg.file.id}, function(err, data){
      //     if(err){
      //       cosole.log(err);
      //     }
      //     if(data){
      //       console.log(data);
      //
      //       Post.findOrCreate({fileId: msg.file.id}, {
      //         postContent: data.content_html,
      //         author: msg.user,
      //         fileId: msg.file.id,
      //         fileData: msg.file
      //       })
      //
      //       Post.findOne({fileId: msg.file.id}, function(err, post){
      //         if(err){
      //           console.log(err);
      //         }
      //         if(post){
      //           Post.update(post.id, {
      //             channel : data.channel,
      //             postContent: data.content_html,
      //             author: msg.user,
      //             fileId: msg.file.id,
      //             fileData: msg.file,
      //             messageData: msg
      //           }, function(err, update){
      //             if(err){
      //               console.log(err);
      //             }
      //           });
      //         } else {
      //           Post.create({
      //             postContent: data.content_html,
      //             author: msg.user,
      //             fileId: msg.file.id,
      //             fileData: msg.file
      //           }, function(err, newPost){
      //             if(err){
      //               console.log(err);
      //             }
      //           });
      //         }
      //       });
      //
      //     }
      //   });
      //
      // }

    });

    // start listening to the slack team associated to the token
    bot.listen({
      token:token
    });

  }

};
