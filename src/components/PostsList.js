import React from 'react';
import { Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store/hooks';
import PostCard from './PostCard';
import './PostsList.css';

const PostsList = ({ posts, onPostClick, selectedPosts, onPostSelect, showCheckbox }) => {
    const { t } = useTranslation();
    const { loading, error } = useAppSelector((state) => state.posts);

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t('common.loading')}</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="my-4">
                <Alert.Heading>{t('common.error')}</Alert.Heading>
                <p>{error}</p>
            </Alert>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <Alert variant="info" className="my-4 text-center">
                <Alert.Heading>{t('posts.noPosts')}</Alert.Heading>
                <p>{t('posts.noPosts')}</p>
            </Alert>
        );
    }

    return (
        <div className="posts-list">
            <Row className="g-4">
                {posts.map((post, index) => (
                    <Col key={post.id || index} xs={12} sm={6} md={4} lg={3}>
                        <PostCard 
                            post={post} 
                            onClick={() => onPostClick && onPostClick(post)}
                            isSelected={selectedPosts && selectedPosts.has(post.id)}
                            onSelect={onPostSelect}
                            showCheckbox={showCheckbox}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default PostsList;
