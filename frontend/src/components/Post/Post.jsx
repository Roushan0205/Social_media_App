import React, { useState } from 'react';
import './Post.css';

const Post = ({ post }) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const addComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment,
        author: 'Current User',
        timestamp: new Date().toLocaleString()
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.author}`,
        text: post.content,
        url: window.location.href
      });
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Post link copied to clipboard!');
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-author-info">
          <img 
            src={post.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face&auto=format'} 
            alt={`${post.author}'s avatar`} 
            className="author-avatar"
          />
          <div className="author-details">
            <h4 className="author-name">{post.author}</h4>
            <span className="post-timestamp">{post.timestamp}</span>
          </div>
        </div>
      </div>

      <div className="post-content">
        <p className="post-text">{post.content}</p>
        {post.image && (
          <div className="post-image-container">
            <img src={post.image} alt="Post content" className="post-image" />
          </div>
        )}
      </div>

      <div className="post-actions">
        <button 
          className={`action-btn like-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={liked ? "#ff3040" : "none"} 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>{likeCount}</span>
        </button>

        <button className="action-btn comment-btn" onClick={handleComment}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>{comments.length}</span>
        </button>

        <button className="action-btn share-btn" onClick={handleShare}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16,6 12,2 8,6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          <span>Share</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-author">{comment.author}</div>
                <div className="comment-text">{comment.text}</div>
                <div className="comment-timestamp">{comment.timestamp}</div>
              </div>
            ))}
          </div>
          
          <form className="add-comment-form" onSubmit={addComment}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="comment-input"
            />
            <button type="submit" className="comment-submit-btn">
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;