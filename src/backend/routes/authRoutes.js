const express = require('express');
const { ForgotPassword, verifyCode, resetPassword , login, sendRegistrationEmailController , handleSignUp} = require('../controllers/authController');

const router = express.Router();

router.post('/forgot-password', ForgotPassword);
router.post('/verify-code', verifyCode);
router.post('/reset-password', resetPassword);
router.post('/login', login);
router.post('/send-registration-email', sendRegistrationEmailController);
router.post('/signup', handleSignUp);

module.exports = router;
