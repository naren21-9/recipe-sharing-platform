import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import NoPage from './pages/NoPage';
import Recipe from './pages/Recipe';
import ShareRecipe from './pages/ShareRecipe';
import User from './pages/User';
import EditRecipe from './pages/EditRecipe';
import MyPage from './pages/MyPage';

function App() {
  useEffect(() => {
    localStorage.setItem('isLoggedIn', 'no');
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recipe/:recipeId" element={<Recipe />} />
        <Route path="/edit-recipe/:recipeId" element={<EditRecipe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/share-recipe" element={<ShareRecipe />} />
        <Route path="/user/:userId" element={<User />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="not-found" element={<NoPage />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
