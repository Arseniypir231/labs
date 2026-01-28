import React from 'react';
import './PostCard.css';

const PostCard = ({ post, onClick, isSelected, onSelect, showCheckbox }) => {
    const handleCardClick = (e) => {
        if (showCheckbox && e.target.type !== 'checkbox') {
            onClick && onClick(post);
        }
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        onSelect && onSelect(post.id || post, !isSelected);
    };

    return (
        <article 
            className={`post-card ${isSelected ? 'selected' : ''}`} 
            onClick={handleCardClick}
        >
            {showCheckbox && (
                <div className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={isSelected || false}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
            <img src={post.image} alt={post.alt} />
            <h3 className={post.category === 'SPORT' ? 'sport_h3' : ''}>{post.category}</h3>
            <h2>{post.title}</h2>
            <article className="articleText">
                <h2>{post.date} <span>By</span> {post.author}</h2>
                {post.comments && <h2 className="comments_h2">{post.comments} comments</h2>}
            </article>
            {post.description && <p>{post.description}</p>}
        </article>
    );
};

export default PostCard;
