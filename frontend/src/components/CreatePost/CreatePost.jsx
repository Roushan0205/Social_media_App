import React, { useState, useRef } from 'react';
import './CreatePost.css';

const CreatePost = ({ onAddPost }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
      }
      
      setImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!content.trim() && !image) {
      alert('Please add some content or an image to your post.');
      return;
    }

    const newPost = {
      id: Date.now(),
      author: 'Current User',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format',
      content: content.trim(),
      image: imagePreview,
      timestamp: new Date().toLocaleString(),
      likes: 0,
      liked: false,
      comments: []
    };

    onAddPost(newPost);
    
    // Reset form
    setContent('');
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="create-post">
      <div className="create-post-header">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" 
          alt="Your avatar" 
          className="user-avatar"
        />
        <h3>Create a new post</h3>
      </div>

      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="post-textarea"
          rows="3"
        />

        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
            <button 
              type="button" 
              onClick={removeImage}
              className="remove-image-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        <div className="post-actions">
          <div className="media-actions">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="image-input"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="media-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              Add Photo
            </label>
          </div>

          <button 
            type="submit" 
            className="submit-post-btn"
            disabled={!content.trim() && !image}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;