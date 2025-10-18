import React, { useState, useEffect } from 'react';
import './GitHubStar.css';

const GitHubStar = ({ owner = 'georgioupanayiotis', repo = 'Social_media_App' }) => {
  const [starred, setStarred] = useState(false);
  const [starCount, setStarCount] = useState(0);

  useEffect(() => {
    // Fetch star count from GitHub API
    fetch(`https://api.github.com/repos/${owner}/${repo}`)
      .then(response => response.json())
      .then(data => {
        setStarCount(data.stargazers_count || 0);
      })
      .catch(error => {
        console.error('Error fetching star count:', error);
      });
  }, [owner, repo]);

  const handleStarClick = () => {
    // Open GitHub repository in new tab
    window.open(`https://github.com/${owner}/${repo}`, '_blank');
  };

  const handleStarToggle = () => {
    // This would typically involve GitHub OAuth and API calls
    // For demo purposes, we'll just toggle locally
    setStarred(!starred);
    setStarCount(prev => starred ? prev - 1 : prev + 1);
  };

  return (
    <div className="github-star-container">
      <div className="github-star-widget">
        <button 
          className="github-repo-btn"
          onClick={handleStarClick}
          title={`View ${owner}/${repo} on GitHub`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>GitHub</span>
        </button>

        <button 
          className={`star-btn ${starred ? 'starred' : ''}`}
          onClick={handleStarToggle}
          title={starred ? 'Unstar this repository' : 'Star this repository'}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill={starred ? "#ffd700" : "none"} 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          <span className="star-count">{starCount}</span>
        </button>
      </div>

      <div className="repo-info">
        <h4>⭐ Support this project!</h4>
        <p>If you like this social media app, please consider starring the repository on GitHub!</p>
        <a 
          href={`https://github.com/${owner}/${repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="repo-link"
        >
          {owner}/{repo}
        </a>
      </div>
    </div>
  );
};

export default GitHubStar;