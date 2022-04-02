//-- SQL Database ORM templates, essentially
const { Model, DataTypes } = require('sequelize');

//SQL Database ORM 
/* 
  Pointing to seeds/connection_sequlzie because it's used by seeds to build
*/
const sequelize = require('../config/connection');

//------------------------------------------------------------
//-- Class

// create our Character model
class Resource extends Model {}

//------------------------------------------------------------

// define table columns and configuration
Resource.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      }
    },
    //-- Defined automatically based on where it's created
    type: {
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
    //-- user that created this
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    // //-- KBA associated to this
    // resource_id: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'kba',
    //     key: 'id'
    //   }
    // },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'resource'
  }
);

//-- exporting to index.js
module.exports = Resource;