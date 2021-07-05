const {  DataTypes } = require('sequelize');

const Property = {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    imgs: {
      type: DataTypes.STRING
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
      type: DataTypes.STRING
    },
    lastviewedAt: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  }
  module.exports = Property;

  