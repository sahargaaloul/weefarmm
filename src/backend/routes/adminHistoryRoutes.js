// routes/adminHistoryRoutes.js
const express = require('express');
const router = express.Router();
const AdminHistory = require('../models/AdminHistory');

// Get all admin history
router.get('/', async (req, res) => {
    console.log("Fetching admin history...");
    try {
      const history = await AdminHistory.findAll();
      console.log(history);
      res.json(history);
    } catch (error) {
      console.error('Error fetching admin history:', error);
      res.status(500).json({ error: 'Error fetching admin history' });
    }
});

  

// Delete a specific admin history record by adminEmail
router.delete('/:adminEmail', async (req, res) => {
  try {
    const adminEmail = req.params.adminEmail;
    const result = await AdminHistory.destroy({ where: { adminEmail } });
    if (result > 0) {
      res.status(204).send(); // Successfully deleted
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting admin history record' });
  }
});

// Delete all admin history records
router.delete('/', async (req, res) => {
  try {
    await AdminHistory.destroy({ where: {} });
    res.status(204).send(); // Successfully deleted all
  } catch (error) {
    res.status(500).json({ error: 'Error deleting all admin history records' });
  }
});

module.exports = router;
