const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database'); // Vérifiez que le chemin est correct

const AdminHistory = sequelize.define('AdminHistory', {
    adminEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey:true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
    }
  }, {
    tableName: 'adminhistory',
    timestamps: false
  });
  
  module.exports = AdminHistory;