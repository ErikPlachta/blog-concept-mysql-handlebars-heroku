//-- SQL Database ORM templates, essentially
const { Model, DataTypes } = require('sequelize');

//SQL Database ORM
/* 
  Pointing to seeds/connection_sequlzie because it's used by seeds to build
*/
const sequelize = require('../seeds/connection_sequelize');

//------------------------------------------------------------
//-- Class

// create our User model
class Comment extends Model {}

//------------------------------------------------------------

// define table columns and configuration
Comment.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topics: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //-- Who made comment
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    //-- Original post
    post_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'post',
        key: 'id'
      }
    },
    //-- Related Resources
    resource_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'resource',
        key: 'id'
      }
    },
  },
  
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment'
  }
);
  
//-----------------------------------------------------------------------------
//-- EXPORTS

module.exports = Comment;