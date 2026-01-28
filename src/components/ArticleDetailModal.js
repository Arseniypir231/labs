import React from 'react';
import Modal from './Modal';
import './ArticleDetailModal.css';

const ArticleDetailModal = ({ isOpen, onClose, article }) => {
    if (!article) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="article-detail-modal">
                <img src={article.image} alt={article.title} className="article-detail-image" />
                <div className="article-detail-content">
                    <h3 className="article-detail-category">{article.category}</h3>
                    <h2 className="article-detail-title">{article.title}</h2>
                    <article className="articleText">
                        <h2>{article.date} <span>By</span> {article.author}</h2>
                        <h2 className="comments_h2">{article.comments} comments</h2>
                    </article>
                    <div className="article-detail-text">
                        <p>{article.content}</p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </p>
                        <p>
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
                            officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde 
                            omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ArticleDetailModal;
