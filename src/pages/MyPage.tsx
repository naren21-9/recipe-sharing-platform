import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

interface Recipe {
  user: { username: string };
  id: number;
  title: string;
  description: string;
  comments: any[];
}

interface Comment {
  id: number;
  content: string;
  user: { username: string };
}

const MyPage: React.FC = () => {
  const userId = localStorage.getItem('currentUserId');
  const currentUserName = localStorage.getItem('currentUserName') || 'Admin';
  const navigate = useNavigate(); 
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [userName, setUserName] = useState<string>('');
  const token=localStorage.getItem('currentJWT')

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const response = await axiosInstance.get(`https://f502-14-194-85-214.ngrok-free.app/api/userRecipes/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setUserRecipes(response.data);
        if (response.data.length > 0) {
          setUserName(response.data[0].user.username);
        }
      } catch (error) {
        console.error('Error fetching user recipes:', error);
      }
    };

    const fetchUserComments = async () => {
      try {
        const response = await axiosInstance.get(`https://f502-14-194-85-214.ngrok-free.app/api/userComments/${userId}`
        );
        setUserComments(response.data);
      } catch (error) {
        console.error('Error fetching user comments:', error);
      }
    };

    fetchUserRecipes();
    fetchUserComments();
  }, [userId]);

  const handleDeleteRecipe = async (recipeId: number) => {
    try {
      if (!token) {
        throw new Error('User not authenticated');
      }
      await axiosInstance.delete(`https://f502-14-194-85-214.ngrok-free.app/api/deleteRecipe/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe.id !== recipeId));
      console.log('Recipe deleted successfully!');
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  return (
    <div className="text-center my-20">
      <h1 className="text-3xl font-bold mb-4">
        Welcome {currentUserName}!
      </h1>
      <Link
        to="/share-recipe"
        className="inline-block px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded hover:bg-green-700"
      >
        Share Recipe
      </Link>
      <div className="flex flex-wrap justify-center">
        {userRecipes.map((recipe) => (
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
                <button
                  onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                  className="inline-block px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
                >
                  Edit Recipe
                </button>
                <button
                  onClick={() => handleDeleteRecipe(recipe.id)}
                  className="inline-block px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-700"
                >
                  Delete Recipe
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comment History</h2>
        <div className="flex flex-wrap justify-center">
          {userComments.map((comment, index) => (
            <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Comment #{comment.id}</div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
