import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/', { replace: true });
  };

  return (
    <nav className="bg-gray-800 p-7">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-4xl text-lg font-bold hover:text-gray-400 mr-4">
          <Link to="/">TasteTrove</Link>
        </div>
        <div className="w-full block flex justify-center lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            <Link
              to="/"
              className="block mt-4 text-xl lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-10"
            >
              Home
            </Link>
            {isLoggedIn && (
              <Link
                to="/share-recipe"
                className="block mt-4 text-xl lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-10"
              >
                Share a Recipe
              </Link>
            )}
            {isLoggedIn && (
              <Link
                to="/mypage"
                className="block mt-4 text-xl lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-10"
              >
                My Profile
              </Link>
            )}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="block mt-4 text-xl lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-10"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block mt-4 text-xl lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-10"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
