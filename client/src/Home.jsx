import React from 'react';

const Home = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4 text-blue-600">Welcome to PayGlobe</h1>
      <p className="text-xl mb-8 text-gray-700">Your Global Payment Solution</p>
      <div className="space-x-4">
        <button 
          onClick={() => onNavigate('login')} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
        <button 
          onClick={() => onNavigate('signup')} 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Home;