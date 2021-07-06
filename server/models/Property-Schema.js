const {  DataTypes,Sequelize } = require('sequelize');
const config = require('../config');
const Property = {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    imgs: {
      type: DataTypes.JSON
    },
    address: {
      type: DataTypes.STRING
    },
    area: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.DOUBLE
    },
    bedroom: {
      type: DataTypes.INTEGER
    },
    bath: {
      type: DataTypes.INTEGER
    },
    carpetArea: {
      type: DataTypes.STRING
    },
    carpetAreaUnit: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    viewCount: {
      type: DataTypes.INTEGER
    },
    thumbNails: {
      type: DataTypes.JSON
    },
    lastviewedAt: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    isFavorite:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }

  const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPass, config.conn);
  const propertyTable = sequelize.define('Properties', Property,{timestamps: true});
  module.exports = propertyTable;

  