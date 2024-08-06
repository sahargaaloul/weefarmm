const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Superadmin = sequelize.define('Superadmin', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'superadmin',
  timestamps: false,
});

module.exports = Superadmin;
