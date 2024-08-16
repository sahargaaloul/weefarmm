const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { AdminHistory } = require('../models/AdminHistory'); 

const Admin = sequelize.define('Admin', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: true // ou false si vous souhaitez rendre ce champ obligatoire
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: true
  },
  companyname: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phonenumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  functionality: {
    type: DataTypes.STRING,
    allowNull: true
  },status: {
    type: DataTypes.ENUM,
    values: ['active', 'inactive'],
    defaultValue: 'active'
  }
}, 
{
  tableName: 'admin',
  timestamps: false
});

module.exports = Admin;
