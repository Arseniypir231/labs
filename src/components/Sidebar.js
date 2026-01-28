import React from 'react';
import { Card, ListGroup, Badge, Image, Alert } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './Sidebar.css';

const Sidebar = ({ author, featuredPosts, categories, socials, tags }) => {
    const { t } = useTranslation();
    
    return (
        <aside className="sidebar-custom">
            {/* Author Card */}
            <Card className="sidebar-card mb-4">
                <Card.Header className="sidebar-header">
                    <h2 className="sidebar-title">{t('sidebar.aboutAuthor')}</h2>
                </Card.Header>
                <Card.Body>
                    <div className="sidebar-author-info">
                        <Image 
                            src={author.image} 
                            alt="author" 
                            className="author-image"
                            roundedCircle
                            fluid
                        />
                        <div className="sidebar-author-text">
                            <h3 className="author-name">{author.name}</h3>
                            <h4 className="author-role">{author.role}</h4>
                            <p className="author-description">{author.description}</p>
                            <hr className="sidebar-divider" />
                            <Alert.Link href="#" className="continue-reading">
                                {t('sidebar.continueReading')}
                            </Alert.Link>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Featured Posts */}
            <Card className="sidebar-card mb-4">
                <Card.Header className="sidebar-header">
                    <h2 className="sidebar-title">{t('sidebar.featuredPosts')}</h2>
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        {featuredPosts.map((post, index) => {
                            const tooltip = (
                                <Tooltip id={`featured-tooltip-${index}`}>
                                    {post.title}
                                </Tooltip>
                            );
                            
                            return (
                                <OverlayTrigger key={index} placement="right" overlay={tooltip}>
                                    <ListGroup.Item className="featured-post-item">
                                        <div className="featured-post-content">
                                            <Image 
                                                src={post.image} 
                                                alt={post.alt} 
                                                className="featured-post-image"
                                                fluid
                                            />
                                            <div className="featured-post-text">
                                                <Badge bg="secondary" className="featured-category">
                                                    {post.category}
                                                </Badge>
                                                <h4 className="featured-title">{post.title}</h4>
                                                <div className="featured-meta">
                                                    <span>{post.date}</span>
                                                    <span className="meta-label">{t('hero.by')}</span> {post.author}
                                                </div>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                </OverlayTrigger>
                            );
                        })}
                    </ListGroup>
                </Card.Body>
            </Card>

            {/* Categories */}
            <Card className="sidebar-card mb-4">
                <Card.Header className="sidebar-header">
                    <h2 className="sidebar-title">{t('sidebar.categories')}</h2>
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        {categories.map((category, index) => {
                            const tooltip = (
                                <Tooltip id={`category-tooltip-${index}`}>
                                    {category.count} {t('sidebar.postsIn')} {category.name}
                                </Tooltip>
                            );
                            
                            return (
                                <OverlayTrigger key={index} placement="right" overlay={tooltip}>
                                    <ListGroup.Item className="category-item">
                                        <div className="category-content">
                                            <span className="category-name">{category.name}</span>
                                            <Badge bg="secondary" className="category-count">
                                                {category.count}
                                            </Badge>
                                        </div>
                                    </ListGroup.Item>
                                </OverlayTrigger>
                            );
                        })}
                    </ListGroup>
                </Card.Body>
            </Card>

            {/* Social Media */}
            <Card className="sidebar-card mb-4">
                <Card.Header className="sidebar-header">
                    <h2 className="sidebar-title">{t('sidebar.socialMedia')}</h2>
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        {socials.map((social, index) => {
                            const tooltip = (
                                <Tooltip id={`social-tooltip-${index}`}>
                                    {social.name}: {social.count} {social.label}
                                </Tooltip>
                            );
                            
                            return (
                                <OverlayTrigger key={index} placement="right" overlay={tooltip}>
                                    <ListGroup.Item className="social-item-custom">
                                        <div className="social-content">
                                            <Image 
                                                src={social.icon} 
                                                alt={social.name} 
                                                className="social-icon-img"
                                                fluid
                                            />
                                            <span className="social-text">
                                                {social.count} {social.label}
                                            </span>
                                        </div>
                                    </ListGroup.Item>
                                </OverlayTrigger>
                            );
                        })}
                    </ListGroup>
                </Card.Body>
            </Card>

            {/* Tags */}
            <Card className="sidebar-card mb-4">
                <Card.Header className="sidebar-header">
                    <h2 className="sidebar-title">{t('sidebar.tags')}</h2>
                </Card.Header>
                <Card.Body>
                    <div className="tags-container">
                        {tags.map((tag, index) => {
                            const tooltip = (
                                <Tooltip id={`tag-tooltip-${index}`}>
                                    {t('sidebar.viewPostsTagged')} {tag}
                                </Tooltip>
                            );
                            
                            return (
                                <OverlayTrigger key={index} placement="top" overlay={tooltip}>
                                    <Badge bg="light" text="dark" className="tag-badge">
                                        {tag}
                                    </Badge>
                                </OverlayTrigger>
                            );
                        })}
                    </div>
                </Card.Body>
            </Card>
        </aside>
    );
};

export default Sidebar;
