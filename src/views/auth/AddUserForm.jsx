import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    companyname: '',
    phonenumber: '',
    functionality: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setFormData((prevData) => ({ ...prevData, email }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateInput = () => {
    const nameRegex = /^[A-Za-z]+$/;
    const phoneRegex = /^[1-9][0-9]*$/;

    if (!nameRegex.test(formData.firstname)) {
      setError('Le prénom ne doit contenir que des lettres.');
      return false;
    }
    if (!nameRegex.test(formData.lastname)) {
      setError('Le nom ne doit contenir que des lettres.');
      return false;
    }
    if (formData.companyname && !nameRegex.test(formData.companyname)) {
      setError('Le nom de l\'entreprise ne doit contenir que des lettres.');
      return false;
    }
    if (formData.functionality && !nameRegex.test(formData.functionality)) {
      setError('La fonctionnalité ne doit contenir que des lettres.');
      return false;
    }
    if (!phoneRegex.test(formData.phonenumber)) {
      setError('Le numéro de téléphone doit être composé uniquement de chiffres et ne doit pas commencer par 0.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateInput()) {
      return;
    }

    const email = localStorage.getItem('userEmail');
    console.log('Données envoyées:', { ...formData, email });
  
    try {
      const response = await axios.post('http://localhost:5000/admin/update-user-details', {
        ...formData,
        email
      });
      console.log('Réponse API:', response.data);
      setSuccess(response.data.message);
      setError('');
      setFormData({
        firstname: '',
        lastname: '',
        companyname: '',
        phonenumber: '',
        functionality: '',
        email: ''
      });
    } catch (error) {
      console.error('Erreur Axios:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Une erreur s\'est produite');
      setSuccess('');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstname: '',
      lastname: '',
      companyname: '',
      phonenumber: '',
      functionality: '',
      email: ''
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Ajouter Détails Utilisateur</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Prénom:</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Nom:</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Nom de l'entreprise:</label>
            <input
              type="text"
              name="companyname"
              value={formData.companyname}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Numéro de téléphone:</label>
            <input
              type="text"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Fonctionnalité:</label>
            <input
              type="text"
              name="functionality"
              value={formData.functionality}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
