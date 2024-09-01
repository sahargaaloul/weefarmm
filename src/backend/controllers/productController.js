const Produit = require('../models/product');
const { Op } = require('sequelize');
const ProductHistory = require('../models/productHistory');

// Récupérer un produit par ID
exports.getProduct = async (req, res) => {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    if (produit.tags) {
      produit.tags = produit.tags.map(tag => tag.replace(/\"/g, ''));
    }

    res.json(produit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Produit.findAll();

    // Nettoyer les tags pour chaque produit
    const cleanedProducts = products.map(product => {
      if (product.tags) {
        product.tags = product.tags.map(tag => tag.replace(/\"/g, ''));
      }
      return product;
    });

    res.json(cleanedProducts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Créer un nouveau produit
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, status, category, tags, descriptionComplete } = req.body;
    let imageUrl = req.body.imageUrl || null;

    if (req.file) {
      const filename = req.file.filename;
      imageUrl = `http://localhost:5000/uploads/${filename}`;
    }

    const product = await Produit.create({
      title,
      description,
      price,
      stock,
      status,
      imageUrl,
      category,
      tags,
      descriptionComplete
    });

    // Enregistrez l'historique
    const history = await ProductHistory.create({
      productId: product.id,
      action: 'CREATE',
      details: {
        title,
        description,
        price,
        stock,
        status,
        imageUrl,
        category,
        tags,
        descriptionComplete
      }
    });

    console.log('Product history created:', history); // Ajoutez ceci pour vérifier la création

    res.status(201).json(product);
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(400).json({ error: error.message });
  }
};

// Mettre à jour un produit par ID
exports.updateProduct = async (req, res) => {
  try {
    const { title, description, descriptionComplete, price, stock, status, imageUrl, category, visibility, tags } = req.body;

    let finalImageUrl = imageUrl || null;
    if (Array.isArray(tags)) {
      tags = tags.join(','); // Convertir le tableau en chaîne
    }

    if (req.file) {
      const filename = req.file.filename;
      finalImageUrl = `http://localhost:5000/uploads/${filename}`;
    }

    if (!title || !price || !stock) {
      return res.status(400).json({ message: 'Les champs title, price et stock sont requis' });
    }

    const [updated] = await Produit.update({
      title,
      description,
      descriptionComplete,
      price,
      stock,
      status,
      imageUrl: finalImageUrl,
      category,
      visibility,
      tags
    }, {
      where: { id: req.params.id }
    });

    if (updated) {
      const updatedProduct = await Produit.findByPk(req.params.id);

      if (updatedProduct.tags) {
        updatedProduct.tags = updatedProduct.tags.map(tag => tag.replace(/\"/g, ''));
      }

      // Enregistrez l'historique
      const history = await ProductHistory.create({
        productId: updatedProduct.id,
        action: 'UPDATE',
        details: {
          title,
          description,
          descriptionComplete,
          price,
          stock,
          status,
          imageUrl: finalImageUrl,
          category,
          visibility,
          tags
        }
      });

      console.log('Product history created:', history); // Ajoutez ceci pour vérifier la création

      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Produit non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un produit par ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Produit.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    await Produit.destroy({
      where: { id: req.params.id },
    });

    // Enregistrez l'historique
    const history = await ProductHistory.create({
      productId: product.id,
      action: 'DELETE',
      details: {
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock,
        status: product.status,
        imageUrl: product.imageUrl,
        category: product.category,
        tags: product.tags,
        descriptionComplete: product.descriptionComplete
      }
    });

    console.log('Product history created:', history); // Ajoutez ceci pour vérifier la création

    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(400).json({ error: error.message });
  }
};



// Lister les produits avec des filtres optionnels
exports.listProducts = async (req, res) => {
  const { category, minPrice, maxPrice, status } = req.query;
  try {
    const produits = await Produit.findAll({
      where: {
        ...(category && { category }),
        ...(minPrice && { price: { [Op.gte]: minPrice } }),
        ...(maxPrice && { price: { [Op.lte]: maxPrice } }),
        ...(status && { status }),
      },
    });

    // Nettoyer les tags pour chaque produit
    const cleanedProduits = produits.map(produit => {
      if (produit.tags) {
        produit.tags = produit.tags.map(tag => tag.replace(/\"/g, ''));
      }
      return produit;
    });

    res.json(cleanedProduits);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Rechercher des produits


exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const product = await Produit.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.status = status;
    await product.save();
    res.json({ message: 'Status updated successfully', product });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut :', error); // Log de l'erreur pour plus de détails
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.updateVisibility = async (req, res) => {
  const { id } = req.params;
  const { visibility } = req.body;

  console.log("Received visibility:", visibility); // Ajoutez ceci pour vérifier la valeur reçue

  if (!['public', 'prive'].includes(visibility)) {
    return res.status(400).json({ message: 'Invalid visibility value' });
  }

  try {
    const product = await Produit.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.visibility = visibility;
    await product.save();
    res.json({ message: 'Visibility updated successfully', product });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la visibilité :', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


