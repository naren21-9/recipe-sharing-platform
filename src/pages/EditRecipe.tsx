import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { AxiosError } from 'axios';
import { useAuth } from '../AuthContext';

interface Recipe {
  title: string;
  description: string;
}

const EditRecipe: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const [recipe, setRecipe] = useState<Recipe>({
    title: '',
    description: '',
  });
  const navigate = useNavigate();
  const token=localStorage.getItem('currentJWT')
  const { isLoggedIn }=useAuth()

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axiosInstance.get(`https://f502-14-194-85-214.ngrok-free.app/api/getRecipe/${recipeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        const fetchedRecipe = response.data;
        setRecipe({
          title: fetchedRecipe.title,
          description: fetchedRecipe.description,
        });
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      console.log(token)
      if (!token) {
        throw new Error('User not authenticated');
      }
      const formData = new FormData();
      formData.append('title', recipe.title);
      formData.append('description', recipe.description);

      const response = await axiosInstance.put(
        `https://f502-14-194-85-214.ngrok-free.app/api/editRecipe/${recipeId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        console.log('Recipe updated successfully!');
        navigate(`/recipe/${recipeId}`); 
      } else {
        throw new Error(`Update failed with status ${response.status}`);
      }
    } catch (error: any) {
      console.error('Error updating recipe:', error.response ? error.response.data : error.message);
    }
  };

  /* 
  if (!recipe.title.trim() || !recipe.description.trim()) {
    return <div>Loading...</div>;
  }
*/

return (
  <div className="max-w-2xl mx-auto p-4">
    <h1 className="text-3xl font-bold mb-4">Edit Recipe</h1>
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-1">Name of your recipe</label>
        <input
          type="text"
          name="title"
          value={recipe.title}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          placeholder="Enter the name of your recipe"
          required
        />
      </div>
      <div>
        <label className="block mb-1">Description</label>
        <textarea
          name="description"
          value={recipe.description}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          placeholder="Enter the ingredients"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-gray-400 hover:bg-gray-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Update Recipe
      </button>
    </form>
  </div>
);
};


export default EditRecipe;
