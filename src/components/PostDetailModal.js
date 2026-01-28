import React from 'react';
import Modal from './Modal';
import './PostDetailModal.css';

const PostDetailModal = ({ isOpen, onClose, post }) => {
    if (!post) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="post-detail-modal">
                <img src={post.image} alt={post.alt || post.title} className="post-detail-image" />
                <div className="post-detail-content">
                    <h3 className={`post-detail-category ${post.category === 'SPORT' ? 'sport_h3' : ''}`}>
                        {post.category}
                    </h3>
                    <h2 className="post-detail-title">{post.title}</h2>
                    <article className="articleText">
                        <h2>{post.date} <span>By</span> {post.author}</h2>
                        {post.comments && (
                            <h2 className="comments_h2">{post.comments} comments</h2>
                        )}
                    </article>
                    {post.description && (
                        <p className="post-detail-description">{post.description}</p>
                    )}
                    {!post.description && (
                        <p className="post-detail-description">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </p>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default PostDetailModal;
