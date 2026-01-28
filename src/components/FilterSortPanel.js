import React, { useState } from 'react';
import { Card, Form, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { FaFilter, FaSort, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import './FilterSortPanel.css';

const FilterSortPanel = ({ onFilterChange, onSortChange }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const posts = useAppSelector((state) => state.posts.posts);
    
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: 'all',
        author: 'all',
        searchQuery: ''
    });
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    // Получаем уникальные значения для фильтров
    const categories = ['all', ...new Set(posts.map(post => post.category).filter(Boolean))];
    const authors = ['all', ...new Set(posts.map(post => post.author).filter(Boolean))];

    const handleFilterChange = (filterType, value) => {
        const newFilters = {
            ...filters,
            [filterType]: value
        };
        setFilters(newFilters);
        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };

    const handleSortChange = (sortType, order) => {
        setSortBy(sortType);
        setSortOrder(order);
        if (onSortChange) {
            onSortChange({ sortBy: sortType, sortOrder: order });
        }
    };

    const handleReset = () => {
        const resetFilters = {
            category: 'all',
            author: 'all',
            searchQuery: ''
        };
        setFilters(resetFilters);
        setSortBy('date');
        setSortOrder('desc');
        if (onFilterChange) {
            onFilterChange(resetFilters);
        }
        if (onSortChange) {
            onSortChange({ sortBy: 'date', sortOrder: 'desc' });
        }
    };

    const getFilteredCount = () => {
        let filtered = posts;
        
        if (filters.category !== 'all') {
            filtered = filtered.filter(post => post.category === filters.category);
        }
        if (filters.author !== 'all') {
            filtered = filtered.filter(post => post.author === filters.author);
        }
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(post => 
                post.title?.toLowerCase().includes(query) ||
                post.description?.toLowerCase().includes(query)
            );
        }
        
        return filtered.length;
    };

    return (
        <Card className="filter-sort-panel mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <FaFilter />
                    <span>{t('filter.filterBy')}</span>
                </div>
                <Button
                    variant="link"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="toggle-btn"
                >
                    {showFilters ? <FaTimes /> : <FaFilter />}
                </Button>
            </Card.Header>
            
            {showFilters && (
                <Card.Body>
                    <Row className="g-3">
                        <Col xs={12} md={6} lg={3}>
                            <Form.Label>{t('filter.category')}</Form.Label>
                            <Form.Select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat === 'all' ? t('filter.all') : cat}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        
                        <Col xs={12} md={6} lg={3}>
                            <Form.Label>{t('filter.author')}</Form.Label>
                            <Form.Select
                                value={filters.author}
                                onChange={(e) => handleFilterChange('author', e.target.value)}
                            >
                                {authors.map(author => (
                                    <option key={author} value={author}>
                                        {author === 'all' ? t('filter.all') : author}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        
                        <Col xs={12} md={6} lg={3}>
                            <Form.Label>{t('filter.sortBy')}</Form.Label>
                            <Form.Select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value, sortOrder)}
                            >
                                <option value="date">{t('filter.date')}</option>
                                <option value="title">{t('form.title')}</option>
                                <option value="author">{t('filter.author')}</option>
                                <option value="category">{t('filter.category')}</option>
                            </Form.Select>
                        </Col>
                        
                        <Col xs={12} md={6} lg={3}>
                            <Form.Label>{t('filter.order')}</Form.Label>
                            <ButtonGroup className="w-100">
                                <Button
                                    variant={sortOrder === 'asc' ? 'primary' : 'outline-primary'}
                                    onClick={() => handleSortChange(sortBy, 'asc')}
                                    size="sm"
                                >
                                    <FaSort className="me-1" />
                                    {t('filter.ascending')}
                                </Button>
                                <Button
                                    variant={sortOrder === 'desc' ? 'primary' : 'outline-primary'}
                                    onClick={() => handleSortChange(sortBy, 'desc')}
                                    size="sm"
                                >
                                    <FaSort className="me-1" style={{ transform: 'rotate(180deg)' }} />
                                    {t('filter.descending')}
                                </Button>
                            </ButtonGroup>
                        </Col>
                        
                        <Col xs={12}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="filter-info">
                                    <span className="text-muted">
                                        {t('common.selected')}: {getFilteredCount()} / {posts.length}
                                    </span>
                                </div>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={handleReset}
                                >
                                    <FaTimes className="me-1" />
                                    {t('common.reset', 'Reset')}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            )}
        </Card>
    );
};

export default FilterSortPanel;
