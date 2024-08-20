import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../AuthContext';

interface User {
  id: number;
  username: string;
  password: string;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  mode: string;
  user: User;
  comments: any[];
}

const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const endpoint = isLoggedIn ? "/api/allRecipes" : "/api/publicRecipes";
        const response = await axiosInstance.get(`https://f502-14-194-85-214.ngrok-free.app${endpoint}`, {
          headers: { 'Content-Type': 'application/json' }
        });
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, [isLoggedIn]);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-center my-20">
      <div className="mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search recipes by title..."
          className="px-4 py-2 border rounded w-1/2"
        />
      </div>
      <div className="flex flex-wrap justify-center">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{recipe.title}</div>
              <p className="text-gray-700 text-base">
                Author: {recipe.user.username}
              </p>
              <div className="flex flex-col space-y-2">
                <Link
                  to={`/recipe/${recipe.id}`}
                  className="inline-block mt-2 px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded hover:bg-gray-700">
                  View Recipe
                </Link>
                <Link
                  to={`/user/${recipe.user.id}`}
                  className="inline-block mt-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-500">
                  View User
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!isLoggedIn && (
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded hover:bg-gray-700">
          Log in to view all recipes
        </button>
      )}
    </div>
  );
};

export default Home;
