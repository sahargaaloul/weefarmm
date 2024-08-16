const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Get all admins
router.get('/admins', adminController.getAllAdmins);

// Get an admin by email
router.get('/admins/:email', adminController.getAdminByEmail);

// Add a new admin
router.post('/admins', adminController.addAdmin);

// Update admin information
router.patch('/admins/:email', adminController.updateAdmin);

router.patch('/admins/:email/status', adminController.updateStatus);
router.post('/login', adminController.login);
router.post('/update-user-details', adminController.updateUserDetails); 

module.exports = router;
