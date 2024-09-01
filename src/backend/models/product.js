const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  descriptionComplete: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM('fruit', 'legumes', 'animaux', 'materiels', 'plantes', 'arbres'),
    allowNull: true,
  },
  visibility: {
    type: DataTypes.ENUM('public', 'prive'),
    defaultValue: 'public',
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      const value = this.getDataValue('tags');
      return value ? value.split(',') : []; // Convertir la chaîne en tableau
    },
    set(value) {
      if (Array.isArray(value)) {
        this.setDataValue('tags', value.join(',')); // Convertir le tableau en chaîne
      } else {
        this.setDataValue('tags', value); // Assumer que c'est déjà une chaîne
      }
    }
  },
}, {
  timestamps: true,
  tableName: 'products', // Nom de la table spécifié ici
});

module.exports = Product;
