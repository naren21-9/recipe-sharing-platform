import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

interface Recipe {
  user: { username: string };
  id: number;
  title: string;
  description: string;
  mode: string; 
  comments: any[];
}

const User: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const token = localStorage.getItem('currentJWT');
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const endpoint = `https://f502-14-194-85-214.ngrok-free.app/api/userRecipes/${userId}`;

        const response = await axiosInstance.get(endpoint);
        const filteredRecipes = response.data.filter((recipe: Recipe) => {
          if (!isLoggedIn && recipe.mode === 'private') {
            return false; 
          }
          return true;
        });

        setUserRecipes(filteredRecipes);

        if (filteredRecipes.length > 0) {
          setUserName(filteredRecipes[0].user.username);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchUserRecipes();
  }, [userId, isLoggedIn]);

  const filteredRecipes = userRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (userRecipes.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-center my-20">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to {userName}'s Page
      </h1>
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
            className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white"
          >
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{recipe.title}</div>
              <div className="flex flex-col space-y-2">
                <Link
                  to={`/recipe/${recipe.id}`}
                  className="inline-block px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded hover:bg-gray-700"
                >
                  View Recipe
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default User;
