import React from 'react';
import { Card, Badge, Form, Button } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import { toast } from 'react-toastify';
import './PostCard.css';

const PostCard = ({ post, onClick, isSelected, onSelect, showCheckbox }) => {
    const { toggleFavorite, isFavorite } = useApp();
    const favorite = isFavorite(post.id, post.type || 'post');
    
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        toggleFavorite({ ...post, type: post.type || 'post' });
        toast.success(favorite ? 'Удалено из избранного' : 'Добавлено в избранное');
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
            Click to view details
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
                            {post.category}
                        </Badge>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>{favorite ? 'Удалить из избранного' : 'Добавить в избранное'}</Tooltip>}
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
                    <Card.Title className="post-card-title">{post.title}</Card.Title>
                    <Card.Text as="div" className="post-meta">
                        <span className="meta-item">{post.date}</span>
                        <span className="meta-item">
                            <span className="meta-label">By</span> {post.author}
                        </span>
                        {post.comments && (
                            <span className="meta-item comments">{post.comments} comments</span>
                        )}
                    </Card.Text>
                    {post.description && (
                        <Card.Text className="post-description">{post.description}</Card.Text>
                    )}
                </Card.Body>
            </Card>
        </OverlayTrigger>
    );
};

export default PostCard;
