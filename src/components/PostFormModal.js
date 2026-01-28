import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './PostFormModal.css';

const PostFormModal = ({ isOpen, onClose, post, onSave }) => {
    const [formData, setFormData] = useState({
        image: '',
        alt: '',
        category: '',
        title: '',
        date: '',
        author: '',
        comments: '',
        description: ''
    });

    useEffect(() => {
        if (post) {
            setFormData({
                image: post.image || '',
                alt: post.alt || '',
                category: post.category || '',
                title: post.title || '',
                date: post.date || '',
                author: post.author || '',
                comments: post.comments || '',
                description: post.description || ''
            });
        } else {
            // Установить текущую дату по умолчанию
            const today = new Date();
            const formattedDate = today.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            setFormData({
                image: '',
                alt: '',
                category: '',
                title: '',
                date: formattedDate,
                author: 'Rickie Baroch',
                comments: '',
                description: ''
            });
        }
    }, [post, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const postData = {
            ...formData,
            comments: formData.comments ? parseInt(formData.comments) : undefined
        };
        onSave(postData, post ? post.id : null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="post-form-modal">
                <h2>{post ? 'Edit Post' : 'Add New Post'}</h2>
                <form onSubmit={handleSubmit}>
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
                        <label htmlFor="alt">Image Alt Text</label>
                        <input
                            type="text"
                            id="alt"
                            name="alt"
                            value={formData.alt}
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
                            <option value="TOURISM">TOURISM</option>
                            <option value="SPORT">SPORT</option>
                            <option value="FASHION">FASHION</option>
                            <option value="CLOTHES">CLOTHES</option>
                            <option value="SUMMER">SUMMER</option>
                            <option value="AUTUMN">AUTUMN</option>
                        </select>
                    </div>
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
                        <label htmlFor="comments">Comments (optional)</label>
                        <input
                            type="number"
                            id="comments"
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description (optional)</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-save">
                            {post ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default PostFormModal;
