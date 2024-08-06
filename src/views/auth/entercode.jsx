import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiKey, FiAlertCircle } from 'react-icons/fi';

const EnterCode = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/reset-password', { state: { email } });
      } else {
        setError(data.message || 'Code de vérification invalide.');
      }
    } catch (error) {
      setError('Une erreur est survenue.');
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-8">
        <div className="text-center">
          <FiKey className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Entrez le Code de Vérification</h2>
          <p className="mt-2 text-sm text-gray-600">
            Nous avons envoyé un code de vérification à votre e-mail. Veuillez le saisir ci-dessous pour continuer.
          </p>
        </div>
        {error && (
          <div className="flex items-center justify-center text-red-500 mb-4">
            <FiAlertCircle className="mr-2" />
            <p>{error}</p>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="code" className="sr-only">Code de Vérification</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Entrez votre code"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
            >
              Vérifier le Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnterCode;
