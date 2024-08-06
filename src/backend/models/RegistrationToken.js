// models/RegistrationToken.js
const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const RegistrationToken = sequelize.define('RegistrationToken', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'registration_tokens',
  timestamps: false,
});

module.exports = RegistrationToken;
