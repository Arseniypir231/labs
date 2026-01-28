import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './ArticleFormModal.css';

const ArticleFormModal = ({ isOpen, onClose, article, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        category: '',
        date: '',
        author: '',
        content: '',
        comments: 0
    });

    useEffect(() => {
        if (article) {
            setFormData({
                title: article.title || '',
                image: article.image || '',
                category: article.category || '',
                date: article.date || '',
                author: article.author || '',
                content: article.content || '',
                comments: article.comments || 0
            });
        } else {
            const today = new Date();
            const formattedDate = today.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            setFormData({
                title: '',
                image: '',
                category: '',
                date: formattedDate,
                author: 'Rickie Baroch',
                content: '',
                comments: 0
            });
        }
    }, [article, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const articleData = {
            ...formData,
            comments: parseInt(formData.comments) || 0
        };
        onSave(articleData, article ? article.id : null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="article-form-modal">
                <h2>{article ? 'Edit Article' : 'Add New Article'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Image URL</label>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Photography">Photography</option>
                            <option value="Travel">Travel</option>
                            <option value="Technology">Technology</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            type="text"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="author">Author</label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="8"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="comments">Comments Count</label>
                        <input
                            type="number"
                            id="comments"
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-save">
                            {article ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ArticleFormModal;
