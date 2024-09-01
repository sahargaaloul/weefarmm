// routes/productHistoryRoutes.js
const express = require('express');
const router = express.Router();
const ProductHistory = require('../models/productHistory'); // Assurez-vous que ce chemin est correct

// Get all product history
router.get('/', async (req, res) => {
    console.log("Fetching product history...");
    try {
        const history = await ProductHistory.findAll();
        console.log(history);
        res.json(history);
    } catch (error) {
        console.error('Error fetching product history:', error);
        res.status(500).json({ error: 'Error fetching product history' });
    }
});

// Delete a specific product history record by productId
router.delete('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const result = await ProductHistory.destroy({ where: { productId } });
        if (result > 0) {
            res.status(204).send(); // Successfully deleted
        } else {
            res.status(404).json({ error: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product history record' });
    }
});

// Delete all product history records
router.delete('/', async (req, res) => {
    try {
        await ProductHistory.destroy({ where: {} });
        res.status(204).send(); // Successfully deleted all
    } catch (error) {
        res.status(500).json({ error: 'Error deleting all product history records' });
    }
});

module.exports = router;
