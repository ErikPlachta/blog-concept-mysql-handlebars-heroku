//------------------------------------------------------------------------------
//-- Modules for Sequelize ORM

const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Resource = require('./Resource');

//------------------------------------------------------------------------------
//-- Associations between tables

//-- Post to Users
/*
  If user related to a Post
// */
User.hasMany(Post, {
  foreignKey: 'user_id'
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
});

//-- Resources to Users - Like images attached to posts, etc.

/*
  If a User creates posts or comments with resources, linked to them.
*/
User.hasMany(Resource, {
  foreignKey: 'user_id'
});

Resource.belongsTo(User, {
  foreignKey: 'user_id',
});




// //-- Post to Resources

/*
  If a Post has a comment
*/
Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id',
});

/*
  If a Post has a Resource
*/
Post.hasOne(Resource, {
  foreignKey: 'post_id'
});

Resource.belongsTo(Post, {
  foreignKey: 'post_id',
});

/*
  If a user creates a resource
*/
User.hasMany(Resource, {
  foreignKey: 'user_id'
});

Resource.belongsTo(User, {
  foreignKey: 'user_id',
});

/*
  If a user creates a profile-resource-image
*/

User.hasOne(Resource, {
  foreignKey: 'profile_resource_id',
});

Resource.belongsTo(User, {
  foreignKey: 'profile_resource_id',
});

/* 
{ TODO:: 02/10/2022 #EP | Add cascading
      EXAMPLE FROM:  UNC/../Modules/M13/05/ONE-TO-MANY    
      Reader.hasOne(LibraryCard, {
          nKey: 'reader_id',
          onDelete: 'CASCADE'
        });

  //-- how tod delete all related content
  // Resource.hasOne(User, {
  //   foreignKey: 'user_id',
  //   //-- Join statement, delete card if reader removed
  //   onDelete: 'CASCADE',
  // });
      }
*/

/*  TODO:: 02/10/2022 #EP | Add an interum shared database used together
        
      EXAMPLE FROM: C:\Repo\UNC\FullstackBootcamp\Module Projects\13_ORM\models\index.js

*/


/*  TODO:: 02/10/2022 #EP | Add many-to-one association
  
  By creating one-to-many associations directly between these models,
    we can perform aggregated SQL functions between models. In this case,
    we'll see a total count of votes for a single post when queried. This
    would be difficult if we hadn't directly associated the Vote model with
    the other two.
  

*/



//-----------------------------------------------------------------------------
//-- EXPORTS

module.exports = { User, Post, Comment, Resource };
