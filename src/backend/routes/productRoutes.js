const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/uploadMiddleware');

// Routes CRUD pour les produits
router.get('/products/:id', productController.getProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/products', productController.listProducts);

// Route pour créer un nouveau produit
router.post('/products', upload.single('image'), productController.createProduct);

// Route pour mettre à jour un produit par ID
router.put('/products/:id', upload.single('image'), productController.updateProduct);

router.patch('/products/:id/status', productController.updateStatus);
router.patch('/products/:id/visibility', productController.updateVisibility);


// Route de recherche de produits
router.get('/search', productController.searchProducts);

module.exports = router;
