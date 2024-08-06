// verificationcode.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Vérifiez le chemin

const VerificationCode = sequelize.define('VerificationCode', {
  email: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  tableName: 'verification_codes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = VerificationCode;
