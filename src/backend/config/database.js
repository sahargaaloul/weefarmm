const { Sequelize, DataTypes } = require('sequelize');

// Créez une instance de Sequelize
const sequelize = new Sequelize('database_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log,
  });
  
  module.exports = {
    sequelize,
    jwtSecret: '1234' 
  };