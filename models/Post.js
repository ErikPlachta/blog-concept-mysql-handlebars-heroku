//-- SQL Database ORM templates, essentially
const { Model, DataTypes } = require('sequelize');

//SQL Database ORM
/* 
  Pointing to seeds/connection_sequlzie because it's used by seeds to build
*/
const sequelize = require('../config/connection');

//------------------------------------------------------------
//-- Class

// create our User model
class Post extends Model {}

//------------------------------------------------------------

// define table columns and configuration
Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    //-- if false stays in database but just doesn't show up
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    //-- What's it aobut?
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //-- assigned tags
    topics: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    //-- Who created it
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    //-- Any attached resources?
    // resource_id: {
    //   allowNull: true,
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'resource',
    //     key: 'id'
    //   }
    // },
  },
  
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'post'
  }
);
  
//-----------------------------------------------------------------------------
//-- EXPORTS

module.exports = Post;