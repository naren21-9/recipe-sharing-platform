import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../AuthContext';

interface Comment {
  id: number;
  user: {
    id: number;
    username: string;
  };
  content: string;
  editedTime?: string | null;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  user: {
    id: number;
    username: string;
  };
  comments: Comment[];
}

const Recipe: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [isLoggedInUser, setIsLoggedInUser] = useState<boolean>(false);
  const [copyLinkMessage,setCopyLinkMessage] = useState<string>("Copy Link to Share")
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const { recipeId } = useParams<{ recipeId: string }>();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const token=localStorage.getItem('currentJWT')

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        if (!recipeId) return;
        console.log(token)
        const response = await axiosInstance.get(`https://f502-14-194-85-214.ngrok-free.app/api/getRecipe/${recipeId}`,
          {
            headers: {
              Authorization: `${token}`
            }
          }
        );
        setRecipe(response.data);
        if (response.data.user?.username === localStorage.getItem('currentUserName')) {
          setIsLoggedInUser(true);
        }
      } catch (error:any) {
        if(error.response.status==404){
          return navigate('/not-found')
        }
        console.error('Error fetching recipe:', error);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!token || newComment.trim() === '') return;

    if (editCommentId !== null) {
      const formData = new FormData();
      formData.append('content', newComment);

      try {
        const response = await axiosInstance.put(
          `https://f502-14-194-85-214.ngrok-free.app/api/editComment/${editCommentId}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        const updatedComment = response.data; 
        console.log('Comment updated successfully:', updatedComment);

        setRecipe((prevRecipe) => {
          if (prevRecipe) {
            const updatedComments = prevRecipe.comments.map((comment) =>
              comment.id === updatedComment.id ? updatedComment : comment
            );
            return {
              ...prevRecipe,
              comments: updatedComments,
            };
          }
          return prevRecipe;
        });
        setEditCommentId(null);
        setNewComment('');
      } catch (error) {
        console.error('Error updating comment:', error);
      }
    } else {
      const formData = new FormData();
      formData.append('content', newComment);

      try {
        const response = await axiosInstance.post(
          `https://f502-14-194-85-214.ngrok-free.app/api/addComment/${recipeId}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        const newCommentData = response.data;
        console.log('Comment added successfully:', newCommentData);

        setRecipe((prevRecipe) => {
          if (prevRecipe) {
            return {
              ...prevRecipe,
              comments: [...prevRecipe.comments, newCommentData],
            };
          }
          return prevRecipe;
        });
        setNewComment('');
      } catch (error) {
        console.error('Error posting comment:', error);
      }
    }
  };

  const handleEditComment = (commentId: number, content: string) => {
    setEditCommentId(commentId);
    setNewComment(content);
  };

  const handleDeleteComment = async (commentId: number) => {

    try {
      await axiosInstance.delete(
        `https://f502-14-194-85-214.ngrok-free.app/api/deleteComment/${commentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      setRecipe((prevRecipe) => {
        if (prevRecipe) {
          const updatedComments = prevRecipe.comments.filter((comment) => comment.id !== commentId);
          return {
            ...prevRecipe,
            comments: updatedComments,
          };
        }
        return prevRecipe;
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEditRecipe = () => {
    navigate(`/edit-recipe/${recipeId}`);
  };

  const handleDeleteRecipe = async () => {
    if (!isLoggedInUser) return; 

    try {
      await axiosInstance.delete(
        `https://f502-14-194-85-214.ngrok-free.app/api/deleteRecipe/${recipeId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      navigate('/');
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyLinkMessage("Copied to Clipboard");
      console.log("Copied to Clipboard");
    }).catch((error) => {
      console.error('Error copying link:', error);
    });
  };

  const handleMouseOut = ()=>{
    setCopyLinkMessage("Copy Link to Share")
  }
  

  if (!recipe) {
    return <div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">{recipe.title}</h2>
        <button
          onClick={handleCopyLink} onMouseOut={handleMouseOut}
          className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-700"
        >
        {copyLinkMessage}
        </button>

      </div>
      <p className="text-gray-600 mb-4">Author: {recipe.user?.username}</p>
      <p className="text-lg">{recipe.description}</p>

      {isLoggedInUser && (
        <div className="mt-4">
          <button
            onClick={handleEditRecipe}
            className="bg-blue-500 text-white rounded py-2 px-4 mr-4 hover:bg-blue-700"
          >
            Edit Recipe
          </button>
          <button
            onClick={handleDeleteRecipe}
            className="bg-red-500 text-white rounded py-2 px-4 hover:bg-red-700"
          >
            Delete Recipe
          </button>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Comments</h3>
        {recipe.comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul className="list-disc pl-4">
            {recipe.comments.map((comment) => (
              <li key={comment.id}>
                <p className="text-gray-700">
                  <span className="font-semibold">{comment.user?.username}:</span> {comment.content}
                  {comment.editedTime && <span className="text-sm text-gray-500"> (edited)</span>}
                </p>
                {comment.user.id === parseInt(localStorage.getItem('currentUserId') || '', 10) && (
                  <div>
                    <button
                      onClick={() => handleEditComment(comment.id, comment.content)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">{editCommentId !== null ? 'Edit Comment' : 'Add a Comment'}</h3>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            className="w-full border rounded p-2 mb-4"
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-700"
          >
            {editCommentId !== null ? 'Make Changes' : 'Add Comment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Recipe;
