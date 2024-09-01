const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Vérifiez que le chemin est correct

const ProductHistory = sequelize.define('ProductHistory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    tableName: 'producthistory',
    timestamps: false
});

module.exports = ProductHistory;
