const Superadmin = require('../models/superadmin');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/database');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Request body:', req.body);

  try {
    console.log('Email:', email);
    console.log('Password:', password);

    const superadmin = await Superadmin.findOne({ where: { email } });
    console.log(superadmin);
    if (superadmin && superadmin.password === password) {
      const token = jwt.sign({ email: superadmin.email }, jwtSecret, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
  } catch (err) {
    console.error('Erreur lors de la connexion:', err);
    res.status(500).json({ message: 'Une erreur est survenue' });
  }
};
