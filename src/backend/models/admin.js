const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database'); 

const Admin = sequelize.define('Admin', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true ,
    primaryKey: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'admin',
  timestamps: false
});

module.exports = Admin;