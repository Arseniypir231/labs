import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PostCard from './PostCard';
import './PostsSection.css';

const PostsSection = ({ posts, onPostClick, selectedPosts, onPostSelect, showCheckbox }) => {
    return (
        <Container fluid className="posts-container px-3 px-md-4 px-lg-5">
            {/* First 6 posts in 2 columns */}
            <Row className="g-4 post-row-1">
                {posts.slice(0, 6).map((post, index) => (
                    <Col key={post.id || index} xs={12} sm={6} lg={6}>
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
            
            {/* 7th post full width */}
            {posts[6] && (
                <Row className="g-4 post-row-2">
                    <Col xs={12}>
                        <PostCard 
                            post={posts[6]} 
                            onClick={() => onPostClick && onPostClick(posts[6])}
                            isSelected={selectedPosts && selectedPosts.has(posts[6].id)}
                            onSelect={onPostSelect}
                            showCheckbox={showCheckbox}
                        />
                    </Col>
                </Row>
            )}
            
            {/* Remaining posts in 2 columns */}
            {posts.length > 7 && (
                <Row className="g-4 post-row-3">
                    {posts.slice(7).map((post, index) => (
                        <Col key={post.id || index + 7} xs={12} sm={6} lg={6}>
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
            )}
        </Container>
    );
};

export default PostsSection;
