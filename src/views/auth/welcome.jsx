import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const handleAddAdmin = () => {
    navigate("/send-registration-email");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="mb-4 text-4xl font-bold text-navy-700 dark:text-white">
          Welcome!
        </h1>
        <p className="mb-6 text-base text-gray-600">
          You have successfully signed in.
        </p>
        <button
          onClick={handleAddAdmin}
          className="mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        >
          Ajouter Administrateur
        </button>
      </div>
    </div>
  );
};

export default Welcome;