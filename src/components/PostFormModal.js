import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './PostFormModal.css';

const PostFormModal = ({ isOpen, onClose, post, onSave }) => {
    const { t } = useTranslation();
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
        <Modal 
            show={isOpen} 
            onHide={onClose}
            size="lg"
            centered
            className="post-form-modal-custom"
        >
            <Modal.Header closeButton>
                <Modal.Title>{post ? t('posts.editPost') : t('posts.addPost')}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>{t('form.imageUrl')} <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            required
                            placeholder={t('form.imageUrl')}
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>{t('form.imageAlt')} <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="alt"
                            value={formData.alt}
                            onChange={handleChange}
                            required
                            placeholder={t('form.imageAlt')}
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>{t('form.category')} <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">{t('form.category')}</option>
                            <option value="TOURISM">TOURISM</option>
                            <option value="SPORT">SPORT</option>
                            <option value="FASHION">FASHION</option>
                            <option value="CLOTHES">CLOTHES</option>
                            <option value="SUMMER">SUMMER</option>
                            <option value="AUTUMN">AUTUMN</option>
                        </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>{t('form.title')} <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder={t('form.title')}
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>{t('form.date')} <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            placeholder={t('form.date')}
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>{t('form.author')} <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            required
                            placeholder={t('form.author')}
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>{t('form.comments')} ({t('form.optional')})</Form.Label>
                        <Form.Control
                            type="number"
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            min="0"
                            placeholder={t('form.comments')}
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>{t('form.description')} ({t('form.optional')})</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder={t('form.description')}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonGroup>
                        <Button variant="secondary" onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button variant="primary" type="submit">
                            {post ? t('common.save') : t('common.add')}
                        </Button>
                    </ButtonGroup>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default PostFormModal;
