import React, { useState } from 'react';

import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchMode = () => {
    setIsLogin(!isLogin);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 rounded-lg bg-white w-96">
        <h2 className="text-2xl text-center font-semibold mb-6">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        {isLogin ? <LoginForm /> : <SignupForm switchToLogin={switchToLogin} />}
        <button
          onClick={switchMode}
          className="mt-4 w-full py-2 px-4 bg-gray-400 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black-300"
        >
          {isLogin ? 'Create an Account' : 'Go to Login'}
        </button>
      </div>
    </div>
  );
}

export default Login;
