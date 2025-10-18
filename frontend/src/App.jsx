import React, { useState } from 'react';
import './App.css';
import Filter from './components/Filter/Filter.jsx';
import Post from './components/Post/Post.jsx';
import CreatePost from './components/CreatePost/CreatePost.jsx';
import GitHubStar from './components/GitHubStar/GitHubStar.jsx';

function App() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'John Doe',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format',
      content: 'Just created an amazing filtered image! Check out this cool vintage effect I applied using our new image filter tool. What do you think?',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop&auto=format',
      timestamp: '2 hours ago',
      likes: 12,
      liked: false,
      comments: [
        {
          id: 1,
          text: 'Looks amazing! How did you achieve this effect?',
          author: 'Jane Smith',
          timestamp: '1 hour ago'
        },
        {
          id: 2,
          text: 'Love the vintage vibe! 📸',
          author: 'Mike Johnson',
          timestamp: '30 minutes ago'
        }
      ]
    },
    {
      id: 2,
      author: 'Sarah Wilson',
      authorAvatar: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
      content: 'The new image filters are incredible! I spent hours experimenting with different effects. This app is getting better every day! 🎨✨',
      timestamp: '4 hours ago',
      likes: 8,
      liked: true,
      comments: []
    }
  ]);

  const [activeTab, setActiveTab] = useState('feed');

  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">📸 Social Media Studio</h1>
          <p className="app-subtitle">Share, create, and connect with amazing content</p>
        </div>
      </header>

      <nav className="app-nav">
        <button 
          className={`nav-btn ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          🏠 Feed
        </button>
        <button 
          className={`nav-btn ${activeTab === 'filters' ? 'active' : ''}`}
          onClick={() => setActiveTab('filters')}
        >
          🎨 Filters
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'feed' && (
          <div className="feed-container">
            <div className="sidebar">
              <GitHubStar />
            </div>
            
            <div className="main-content">
              <CreatePost onAddPost={addPost} />
              
              <div className="posts-container">
                {posts.map(post => (
                  <Post key={post.id} post={post} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'filters' && (
          <div className="filters-container">
            <Filter />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
