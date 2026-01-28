import React from 'react';
import { Card, Badge, Form, Button } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { toast } from 'react-toastify';
import { translateCategory, translateContent } from '../utils/translations';
import './PostCard.css';

const PostCard = ({ post, onClick, isSelected, onSelect, showCheckbox }) => {
    const { t } = useTranslation();
    const { toggleFavorite, isFavorite } = useApp();
    const favorite = isFavorite(post.id, post.type || 'post');
    
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        toggleFavorite({ ...post, type: post.type || 'post' });
        toast.success(favorite ? t('favorites.remove') : t('favorites.add', 'Added to favorites'));
    };
    const handleCardClick = (e) => {
        if (showCheckbox && e.target.type !== 'checkbox' && !e.target.closest('.form-check')) {
            onClick && onClick(post);
        }
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        onSelect && onSelect(post.id || post, !isSelected);
    };

    const tooltip = (
        <Tooltip id={`post-tooltip-${post.id}`}>
            {t('posts.viewDetails')}
        </Tooltip>
    );

    return (
        <OverlayTrigger placement="top" overlay={tooltip}>
            <Card 
                className={`post-card-custom ${isSelected ? 'selected' : ''}`} 
                onClick={handleCardClick}
            >
                {showCheckbox && (
                    <div className="checkbox-container">
                        <Form.Check
                            type="checkbox"
                            checked={isSelected || false}
                            onChange={handleCheckboxChange}
                            onClick={(e) => e.stopPropagation()}
                            label=""
                            className="post-checkbox"
                        />
                    </div>
                )}
                <Card.Img 
                    variant="top" 
                    src={post.image} 
                    alt={post.alt || post.title}
                    className="post-card-image"
                />
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <Badge 
                            bg={post.category === 'SPORT' ? 'danger' : 'secondary'} 
                            className="post-category"
                        >
                            {translateCategory(t, post.category)}
                        </Badge>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>{favorite ? t('favorites.remove') : t('favorites.add', 'Add to favorites')}</Tooltip>}
                        >
                            <Button
                                variant="link"
                                size="sm"
                                onClick={handleFavoriteClick}
                                className={`favorite-btn ${favorite ? 'active' : ''}`}
                            >
                                <FaHeart />
                            </Button>
                        </OverlayTrigger>
                    </div>
                    <Card.Title className="post-card-title">
                        {post.titleKey ? t(`content.${post.titleKey}`, { defaultValue: post.title }) : (post.title || translateContent(t, 'postTitle'))}
                    </Card.Title>
                    <Card.Text as="div" className="post-meta">
                        <span className="meta-item">{post.dateKey ? t(`content.${post.dateKey}`, { defaultValue: post.date }) : (post.date || translateContent(t, 'date'))}</span>
                        <span className="meta-item">
                            <span className="meta-label">{t('hero.by')}</span> {post.authorKey ? t(`content.${post.authorKey}`, { defaultValue: post.author }) : (post.author || translateContent(t, 'author'))}
                        </span>
                        {post.comments && (
                            <span className="meta-item comments">{post.comments} {t('hero.comments')}</span>
                        )}
                    </Card.Text>
                    {post.description && (
                        <Card.Text className="post-description">
                            {post.descriptionKey ? t(`content.${post.descriptionKey}`, { defaultValue: post.description }) : post.description}
                        </Card.Text>
                    )}
                </Card.Body>
            </Card>
        </OverlayTrigger>
    );
};

export default PostCard;
