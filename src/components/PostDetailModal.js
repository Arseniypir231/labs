import React from 'react';
import { Modal, Image, Badge, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { translateCategory, translatePostTitle, translateDate, translateAuthor, translateDescription } from '../utils/translations';
import './PostDetailModal.css';

const PostDetailModal = ({ isOpen, onClose, post }) => {
    const { t } = useTranslation();
    
    if (!post) return null;

    return (
        <Modal 
            show={isOpen} 
            onHide={onClose}
            size="lg"
            centered
            className="post-detail-modal-custom"
        >
            <Modal.Header closeButton>
                <Modal.Title>{t('posts.viewDetails')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="post-detail-content">
                    <Image 
                        src={post.image} 
                        alt={post.alt || post.title} 
                        className="post-detail-image mb-3"
                        fluid
                        rounded
                    />
                    <Badge 
                        bg={post.category === 'SPORT' ? 'danger' : 'secondary'} 
                        className="post-detail-category mb-2"
                    >
                        {translateCategory(t, post.category)}
                    </Badge>
                    <h2 className="post-detail-title">
                        {translatePostTitle(t, post.title)}
                    </h2>
                    <div className="post-detail-meta mb-3">
                        <span className="meta-item">{translateDate(t, post.date)}</span>
                        <span className="meta-item">
                            <span className="meta-label">{t('hero.by')}</span> {translateAuthor(t, post.author)}
                        </span>
                        {post.comments && (
                            <span className="meta-item comments">{post.comments} {t('hero.comments')}</span>
                        )}
                    </div>
                    {post.description && (
                        <p className="post-detail-description">
                            {translateDescription(t, post.description)}
                        </p>
                    )}
                    {!post.description && (
                        <p className="post-detail-description">
                            {translateDescription(t, null)}
                        </p>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    {t('common.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PostDetailModal;
