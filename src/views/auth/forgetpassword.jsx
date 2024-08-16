import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Code de vérification envoyé. Veuillez vérifier votre email.');
        localStorage.setItem('email', email); 
        setTimeout(() => navigate('/enter-code', { state: { email } }), 1000);
      } else {
        setError(data.message || 'Erreur lors de l\'envoi du code de vérification.');
      }
    } catch (error) {
      setError('Une erreur est survenue.');
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-8">
        <div className="text-center">
          <FiMail className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Mot de Passe Oublié</h2>
          <p className="mt-2 text-sm text-gray-600">
            Entrez votre adresse e-mail ci-dessous, et nous vous enverrons les instructions pour réinitialiser votre mot de passe.
          </p>
        </div>
        {error && (
          <div className="flex items-center justify-center text-red-500 mb-4">
            <FiAlertCircle className="mr-2" />
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-center justify-center text-green-500 mb-4">
            <FiCheckCircle className="mr-2" />
            <p>{success}</p>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Adresse e-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="votre-email@example.com"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
            >
              Envoyer les instructions
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
