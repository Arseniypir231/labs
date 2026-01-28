import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { FaHeart, FaTrash, FaEye } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import { toast } from 'react-toastify';
import './Favorites.css';

const Favorites = () => {
    const { t } = useTranslation();
    const { favorites, toggleFavorite, isFavorite } = useApp();
    const [activeTab, setActiveTab] = useState('all');

    const handleRemoveFavorite = (item) => {
        toggleFavorite(item);
        toast.success(t('favorites.remove'));
    };

    const handleViewItem = (item) => {
        const path = item.type === 'post' ? '/' : `/${item.type}/${item.id}`;
        window.location.href = path;
    };

    const filteredFavorites = activeTab === 'all' 
        ? favorites 
        : favorites.filter(fav => fav.type === activeTab);

    const groupedFavorites = {
        posts: favorites.filter(f => f.type === 'post'),
        articles: favorites.filter(f => f.type === 'article'),
        recipes: favorites.filter(f => f.type === 'recipe')
    };

    return (
        <Container fluid className="favorites-page px-3 px-md-4 px-lg-5">
            <Row>
                <Col xs={12}>
                    <div className="favorites-header mb-4">
                        <h1 className="favorites-title">
                            <FaHeart className="heart-icon" /> {t('favorites.title')}
                        </h1>
                        <p className="favorites-subtitle">
                            {t('favorites.emptyDescription')}
                        </p>
                    </div>

                    {favorites.length === 0 ? (
                        <Alert variant="info" className="text-center empty-favorites">
                            <FaHeart size={48} className="mb-3" />
                            <h3>{t('favorites.empty')}</h3>
                            <p>{t('favorites.emptyDescription')}</p>
                        </Alert>
                    ) : (
                        <>
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                                className="favorites-tabs mb-4"
                            >
                                <Tab eventKey="all" title={`${t('filter.all')} (${favorites.length})`}>
                                    <FavoritesList 
                                        items={filteredFavorites}
                                        onRemove={handleRemoveFavorite}
                                        onView={handleViewItem}
                                    />
                                </Tab>
                                <Tab eventKey="posts" title={`${t('posts.title')} (${groupedFavorites.posts.length})`}>
                                    <FavoritesList 
                                        items={groupedFavorites.posts}
                                        onRemove={handleRemoveFavorite}
                                        onView={handleViewItem}
                                    />
                                </Tab>
                                <Tab eventKey="articles" title={`${t('navigation.article')} (${groupedFavorites.articles.length})`}>
                                    <FavoritesList 
                                        items={groupedFavorites.articles}
                                        onRemove={handleRemoveFavorite}
                                        onView={handleViewItem}
                                    />
                                </Tab>
                                <Tab eventKey="recipes" title={`${t('navigation.recipes')} (${groupedFavorites.recipes.length})`}>
                                    <FavoritesList 
                                        items={groupedFavorites.recipes}
                                        onRemove={handleRemoveFavorite}
                                        onView={handleViewItem}
                                    />
                                </Tab>
                            </Tabs>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

const FavoritesList = ({ items, onRemove, onView }) => {
    if (items.length === 0) {
        return (
            <Alert variant="secondary" className="text-center">
                В этой категории нет избранных элементов
            </Alert>
        );
    }

    return (
        <Row className="g-4">
            {items.map((item, index) => (
                <Col key={`${item.type}-${item.id}-${index}`} xs={12} sm={6} md={4} lg={3}>
                    <Card className="favorite-card h-100">
                        <div className="favorite-image-wrapper">
                            <Card.Img 
                                variant="top" 
                                src={item.image} 
                                alt={item.alt || item.title}
                                className="favorite-image"
                            />
                                            <div className="favorite-overlay">
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => onRemove(item)}
                                                    className="favorite-remove-btn"
                                                >
                                                    <FaTrash /> {t('favorites.remove')}
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => onView(item)}
                                                    className="favorite-view-btn"
                                                >
                                                    <FaEye /> {t('favorites.view')}
                                                </Button>
                                            </div>
                        </div>
                        <Card.Body>
                            <Badge bg="secondary" className="mb-2">
                                {item.type === 'post' ? 'Пост' : 
                                 item.type === 'article' ? 'Статья' : 'Рецепт'}
                            </Badge>
                            <Card.Title className="favorite-title">{item.title}</Card.Title>
                            <Card.Text className="favorite-meta">
                                <small className="text-muted">
                                    {item.date} • {item.author}
                                </small>
                            </Card.Text>
                            {item.description && (
                                <Card.Text className="favorite-description">
                                    {item.description.substring(0, 100)}...
                                </Card.Text>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default Favorites;
