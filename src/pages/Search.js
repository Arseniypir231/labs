import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Form, InputGroup, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import PostCard from '../components/PostCard';
import postsData from '../data/posts.json';
import articlesData from '../data/articles.json';
import recipesData from '../data/recipes.json';
import './Search.css';

const Search = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        performSearch();
    }, [searchQuery, filterType, sortBy, sortOrder]);

    const performSearch = () => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        
        setTimeout(() => {
            let allItems = [];
            
            if (filterType === 'all' || filterType === 'posts') {
                const posts = postsData.map((post, index) => ({
                    ...post,
                    id: post.id || index + 1,
                    type: 'post'
                }));
                allItems = [...allItems, ...posts];
            }
            
            if (filterType === 'all' || filterType === 'articles') {
                const articles = articlesData.map((article, index) => ({
                    ...article,
                    id: article.id || index + 1,
                    type: 'article'
                }));
                allItems = [...allItems, ...articles];
            }
            
            if (filterType === 'all' || filterType === 'recipes') {
                const recipes = recipesData.map((recipe, index) => ({
                    ...recipe,
                    id: recipe.id || index + 1,
                    type: 'recipe'
                }));
                allItems = [...allItems, ...recipes];
            }

            const query = searchQuery.toLowerCase();
            let filtered = allItems.filter(item => {
                const title = (item.title || '').toLowerCase();
                const category = (item.category || '').toLowerCase();
                const description = (item.description || '').toLowerCase();
                const author = (item.author || '').toLowerCase();
                
                return title.includes(query) || 
                       category.includes(query) || 
                       description.includes(query) ||
                       author.includes(query);
            });

            // Сортировка
            filtered.sort((a, b) => {
                let aValue, bValue;
                
                switch (sortBy) {
                    case 'date':
                        aValue = new Date(a.date || 0);
                        bValue = new Date(b.date || 0);
                        break;
                    case 'title':
                        aValue = (a.title || '').toLowerCase();
                        bValue = (b.title || '').toLowerCase();
                        break;
                    case 'author':
                        aValue = (a.author || '').toLowerCase();
                        bValue = (b.author || '').toLowerCase();
                        break;
                    default:
                        aValue = a.title || '';
                        bValue = b.title || '';
                }
                
                if (sortOrder === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });

            setResults(filtered);
            setLoading(false);
            
            if (filtered.length === 0 && searchQuery.trim()) {
                toast.info(t('search.noResults', { query: searchQuery }));
            }
        }, 300);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ q: searchQuery });
        performSearch();
    };

    const handlePostClick = (post) => {
        const path = post.type === 'post' ? '/' : `/${post.type}/${post.id}`;
        window.location.href = path;
    };

    return (
        <Container fluid className="search-page px-3 px-md-4 px-lg-5">
            <Row>
                <Col xs={12}>
                    <div className="search-header mb-4">
                        <h1 className="search-title">{t('search.title')}</h1>
                        <Form onSubmit={handleSearch} className="search-form">
                            <InputGroup size="lg">
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder={t('search.placeholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => setShowFilters(!showFilters)}
                                    type="button"
                                >
                                    <FaFilter /> {t('common.filter')}
                                </Button>
                                <Button variant="primary" type="submit">
                                    {t('common.search')}
                                </Button>
                            </InputGroup>
                        </Form>
                    </div>

                    {showFilters && (
                        <Card className="filters-card mb-4">
                            <Card.Body>
                                <Row className="g-3">
                                    <Col xs={12} md={4}>
                                        <Form.Label>{t('filter.filterBy')}</Form.Label>
                                        <Form.Select 
                                            value={filterType} 
                                            onChange={(e) => setFilterType(e.target.value)}
                                        >
                                            <option value="all">{t('filter.all')}</option>
                                            <option value="posts">{t('posts.title')}</option>
                                            <option value="articles">{t('navigation.article')}</option>
                                            <option value="recipes">{t('navigation.recipes')}</option>
                                        </Form.Select>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <Form.Label>{t('filter.sortBy')}</Form.Label>
                                        <Form.Select 
                                            value={sortBy} 
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <option value="date">{t('filter.date')}</option>
                                            <option value="title">{t('form.title')}</option>
                                            <option value="author">{t('filter.author')}</option>
                                        </Form.Select>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <Form.Label>{t('filter.order')}</Form.Label>
                                        <Form.Select 
                                            value={sortOrder} 
                                            onChange={(e) => setSortOrder(e.target.value)}
                                        >
                                            <option value="desc">{t('filter.descending')}</option>
                                            <option value="asc">{t('filter.ascending')}</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}

                    {loading && (
                        <div className="text-center my-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    )}

                    {!loading && searchQuery && results.length === 0 && (
                        <Alert variant="info" className="text-center">
                            {t('search.noResults', { query: searchQuery })}
                        </Alert>
                    )}

                    {!loading && results.length > 0 && (
                        <>
                            <div className="results-header mb-3">
                                <h3>{t('search.results', { count: results.length })}</h3>
                            </div>
                            <Row className="g-4">
                                {results.map((item, index) => (
                                    <Col key={`${item.type}-${item.id}-${index}`} xs={12} sm={6} md={4} lg={3}>
                                        <Card className="result-card h-100">
                                            <Card.Img 
                                                variant="top" 
                                                src={item.image} 
                                                alt={item.alt || item.title}
                                                className="result-image"
                                            />
                                            <Card.Body>
                                                <Badge bg="secondary" className="mb-2">
                                                    {item.type === 'post' ? 'Пост' : 
                                                     item.type === 'article' ? 'Статья' : 'Рецепт'}
                                                </Badge>
                                                <Card.Title className="result-title">
                                                    {item.title}
                                                </Card.Title>
                                                <Card.Text className="result-meta">
                                                    <small className="text-muted">
                                                        {item.date} • {item.author}
                                                    </small>
                                                </Card.Text>
                                                {item.description && (
                                                    <Card.Text className="result-description">
                                                        {item.description.substring(0, 100)}...
                                                    </Card.Text>
                                                )}
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    onClick={() => handlePostClick(item)}
                                                    className="mt-2"
                                                >
                                                    Читать далее
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </>
                    )}

                    {!loading && !searchQuery && (
                        <Alert variant="secondary" className="text-center">
                            {t('search.enterQuery')}
                        </Alert>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Search;
