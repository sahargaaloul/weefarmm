const { sendVerificationEmail, sendRegistrationEmail } = require('../nodeMail');
const Superadmin = require('../models/superadmin');
const VerificationCode = require('../models/verificationcode');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RegistrationToken = require('../models/RegistrationToken');
const Admin = require('../models/admin');
const AdminHistory = require('../models/AdminHistory'); 

exports.ForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const superadmin = await Superadmin.findOne({ where: { email } });
    if (!superadmin) {
      return res.status(404).json({ message: 'Email non trouvé.' });
    }

    const code = generateVerificationCode();
    const expires_at = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const cleanedCode = code.trim();

    const existingCode = await VerificationCode.findOne({ where: { email } });

    if (existingCode) {
      existingCode.code = code;
      existingCode.expires_at = expires_at;
      await existingCode.save();
      console.log('Code mis à jour:', existingCode.code);
    } else {
      await VerificationCode.create({ email, code, expires_at });
      console.log('Nouveau code créé:', code);
    }

    console.log('Avant d\'envoyer l\'e-mail de vérification');

    await sendVerificationEmail(email, code);

    console.log('Après avoir envoyé l\'e-mail de vérification');

    res.status(200).json({ message: 'Code de vérification envoyé.' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

function generateVerificationCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const trimmedEmail = email.trim();
    const trimmedCode = code.trim();

    console.log('Recherche du code de vérification pour:', { email: trimmedEmail, code: trimmedCode });
    console.log('Email fourni pour la vérification:', email);

    const verificationCode = await VerificationCode.findOne({
      where: {
        email: trimmedEmail,
        code: trimmedCode
      }
    });

    if (!verificationCode) {
      return res.status(404).json({ message: 'Code de vérification incorrect.' });
    }

    if (verificationCode.expires_at < new Date()) {
      return res.status(400).json({ message: 'Code de vérification expiré.' });
    }

    res.status(200).json({ message: 'Code de vérification valide.' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const user = await Superadmin.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    user.password = password; // Stockage du mot de passe en clair
    await user.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.login = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  try {
      const user = await Superadmin.findOne({ where: { email } });
      if (user) {
          const isPasswordValid = password === user.password;
          if (isPasswordValid) {
              req.session.user = user;
              if (rememberMe) {
                  req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 jours
                  console.log('Session cookie maxAge set for 30 days');
              } else {
                  req.session.cookie.expires = false; // Session expire à la fermeture du navigateur
                  console.log('Session cookie expires set to false');
              }
              console.log('Session created:', req.session);
              res.status(200).json({ message: 'Login successful', rememberMeActive: rememberMe });
          } else {
              res.status(401).json({ message: 'Invalid credentials' });
          }
      } else {
          res.status(401).json({ message: 'Invalid credentials' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

exports.sendRegistrationEmailController = async (req, res) => {
  const { email } = req.body;

  try {
    const token = crypto.randomBytes(20).toString('hex');
    const registrationLink = `http://localhost:3000/sign-up`;

    // Enregistrez le jeton dans la base de données avec une durée d'expiration
    await RegistrationToken.create({ email, token, expiresAt: new Date(Date.now() + 3600000) }); // 1 heure d'expiration

    // Envoyer l'email d'inscription
    await sendRegistrationEmail(email, registrationLink);

    // Enregistrer l'action dans la table adminhistory
    await AdminHistory.create({
      adminEmail: email,
      action: 'registration_email_sent',
      details: {
        emailAdded: email,
        registrationLink,
        token
      }
    });

    res.status(200).json({ message: 'Email d\'inscription envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email d\'inscription:', error); // Log dans la console
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email d\'inscription', error });
  }
};


exports.handleSignUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Received signup request:', { email, password });

    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await Admin.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Créez un nouvel utilisateur
    const newUser = await Admin.create({ email, password });
    console.log('User registered successfully:', newUser);
    res.status(201).json({ message: 'User registered successfully.', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};