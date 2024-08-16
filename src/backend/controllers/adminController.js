const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const AdminHistory = require('../models/AdminHistory');


// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching admins' });
  }
};

// Get admin by email
exports.getAdminByEmail = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.email);
    if (admin) {
      res.json(admin);
    } else {
      res.status(404).json({ error: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching admin' });
  }
};

// Add a new admin
exports.addAdmin = async (req, res) => {
  try {
    const { email, password, firstname, lastname, companyname, phonenumber, functionality } = req.body;
    const newAdmin = await Admin.create({ email, password, firstname, lastname, companyname, phonenumber, functionality });
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json({ error: 'Error adding admin' });
  }
};

// Update admin information
exports.updateAdmin = async (req, res) => {
  try {
    const { email } = req.params;
    const { password, firstname, lastname, companyname, phonenumber, functionality } = req.body;
    const admin = await Admin.findByPk(email);

    if (admin) {
      const oldAdminData = { ...admin.toJSON() };
      const changes = {};

      // Comparer les anciennes et nouvelles valeurs, et stocker les changements
      if (password && password !== admin.password) {
        changes.password = { old: oldAdminData.password, new: password };
        admin.password = password;
      }
      if (firstname && firstname !== admin.firstname) {
        changes.firstname = { old: oldAdminData.firstname, new: firstname };
        admin.firstname = firstname;
      }
      if (lastname && lastname !== admin.lastname) {
        changes.lastname = { old: oldAdminData.lastname, new: lastname };
        admin.lastname = lastname;
      }
      if (companyname && companyname !== admin.companyname) {
        changes.companyname = { old: oldAdminData.companyname, new: companyname };
        admin.companyname = companyname;
      }
      if (phonenumber && phonenumber !== admin.phonenumber) {
        changes.phonenumber = { old: oldAdminData.phonenumber, new: phonenumber };
        admin.phonenumber = phonenumber;
      }
      if (functionality && functionality !== admin.functionality) {
        changes.functionality = { old: oldAdminData.functionality, new: functionality };
        admin.functionality = functionality;
      }

      if (Object.keys(changes).length > 0) {
        await admin.save();

        // Enregistrer l'action dans la table adminhistory
        await AdminHistory.create({
          adminEmail: admin.email,
          action: 'update',
          details: changes
        });
      }

      res.json(admin);
    } else {
      res.status(404).json({ error: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating admin' });
  }
};



exports.updateStatus = async (req, res) => {
  try {
    const { email } = req.params;
    const admin = await Admin.findByPk(email);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const oldStatus = admin.status;

    // Toggle status between 'active' and 'inactive'
    admin.status = admin.status === 'active' ? 'inactive' : 'active';

    await admin.save();

    // Enregistrer l'action dans la table adminhistory
    await AdminHistory.create({
      adminEmail: admin.email,
      action: 'update status',
      details: {
        oldStatus: oldStatus,
        newStatus: admin.status
      }
    });

    return res.status(200).json(admin);
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while updating the status.' });
  }
};


exports.login = async (req, res) => {
    const { email, password, rememberMe } = req.body;
  
    try {
      // Trouver l'administrateur par email
      const admin = await Admin.findOne({ where: { email } });
      if (!admin) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Vérifier le mot de passe en clair
      if (admin.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Vérifier le statut de l'administrateur
      if (admin.status === 'inactive') {
        return res.status(403).json({ message: 'Account is inactive' });
      }
  
      // Générer un token JWT
      const token = jwt.sign({ email: admin.email }, 'your_jwt_secret', { expiresIn: rememberMe ? '7d' : '1h' });
  
      // Configurer les cookies ou la session si nécessaire
      res.cookie('token', token, { httpOnly: true, maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 3600 * 1000 }); // 7 jours ou 1 heure
  
      // Réponse de succès avec redirection
      res.json({ redirectUrl: '/' }); // Changez l'URL de redirection selon vos besoins
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.updateUserDetails = async (req, res) => {
    const { email, firstname, lastname, companyname, phonenumber, functionality } = req.body;
  
    try {
      // Vérifiez si l'utilisateur existe
      const user = await Admin.findOne({ where: { email } });
      if (!user) {
        console.log('Utilisateur non trouvé.'); // Log dans la console
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }
  
      // Mettez à jour les détails de l'utilisateur
      user.firstname = firstname;
      user.lastname = lastname;
      user.companyname = companyname;
      user.phonenumber = phonenumber;
      user.functionality = functionality;
      
      await user.save();
  
      res.status(200).json({ message: 'Détails de l\'utilisateur mis à jour avec succès.', user });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des détails de l\'utilisateur:', error); // Log dans la console
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };