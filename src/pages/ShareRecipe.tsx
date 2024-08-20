import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

const ShareRecipe: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState("public");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem('currentJWT');
    const userid = localStorage.getItem('currentUserId')
    if (!token) {
      console.error('JWT token not found in localStorage');
      return;
    }
    if (!userid) {
      console.error('User ID not found in localStorage');
      return;
    }
    console.log(userid, title, description, mode);

    try {
      const formData = new FormData();
      formData.append('user_acc_id', userid);
      formData.append('title', title);
      formData.append("description", description);
      formData.append("mode", mode);

      const response = await fetch("https://f502-14-194-85-214.ngrok-free.app/api/addRecipe", {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.status === 200) {
        setMessage('Recipe shared successfully');
        setTitle("");
        setDescription("");
        setMode("public");
      } else {
        throw new Error(`Upload failed with status ${response.status}`);
      }
    } catch (error: any) {
      console.error('Recipe sharing failed:', error);
      setMessage('Recipe sharing failed: ' + error.toString());
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Share Your Recipe</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1">Name of your recipe</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            placeholder="Enter the name of your recipe"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            placeholder="Enter the description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <fieldset>
          <legend className="block mb-1">Visibility</legend>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="public"
                required
                checked={mode === 'public'}
                onChange={() => setMode('public')}
                className="form-radio text-blue-500"
              />
              <span className="ml-2">To all users</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="private"
                checked={mode === 'private'}
                onChange={() => setMode('private')}
                className="form-radio text-blue-500"
                required
              />
              <span className="ml-2">To logged in users only</span>
            </label>
          </div>
        </fieldset>
        <button
          type="submit"
          className="bg-gray-400 hover:bg-gray-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Share Recipe
        </button>
      </form>
      {message && <p id='msg'>{message}</p>}
    </div>
  );
};

export default ShareRecipe;
