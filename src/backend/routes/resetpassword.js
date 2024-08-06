const express = require('express');
const router = express.Router();
const Superadmin = require('../models/superadmin');

router.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Superadmin.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    user.password = password; // Stockage du mot de passe en clair
    await user.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
