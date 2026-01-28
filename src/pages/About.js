import React from 'react';
import { Container, Row, Col, Card, Image, ListGroup } from 'react-bootstrap';
import { FaUsers, FaAward, FaRocket, FaHeart } from 'react-icons/fa';
import authorData from '../data/author.json';
import './About.css';

const About = () => {
    const features = [
        {
            icon: <FaUsers />,
            title: 'Наша команда',
            description: 'Профессиональные авторы и редакторы, которые создают качественный контент'
        },
        {
            icon: <FaAward />,
            title: 'Качество',
            description: 'Мы гарантируем высокое качество всех наших материалов'
        },
        {
            icon: <FaRocket />,
            title: 'Инновации',
            description: 'Постоянно развиваемся и внедряем новые технологии'
        },
        {
            icon: <FaHeart />,
            title: 'Страсть',
            description: 'Мы любим то, что делаем, и это видно в каждом нашем проекте'
        }
    ];

    const stats = [
        { number: '1000+', label: 'Статей' },
        { number: '500+', label: 'Рецептов' },
        { number: '50+', label: 'Авторов' },
        { number: '10K+', label: 'Читателей' }
    ];

    return (
        <Container fluid className="about-page px-3 px-md-4 px-lg-5">
            <Row>
                <Col xs={12}>
                    <div className="about-hero mb-5">
                        <h1 className="about-title">О нас</h1>
                        <p className="about-subtitle">
                            Добро пожаловать в наш блог! Мы создаем качественный контент 
                            о моде, стиле жизни, рецептах и многом другом.
                        </p>
                    </div>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col xs={12} md={6} className="mb-4 mb-md-0">
                    <Card className="about-card h-100">
                        <Card.Body className="text-center">
                            <Image 
                                src={authorData.image} 
                                alt={authorData.name}
                                roundedCircle
                                className="author-main-image mb-3"
                            />
                            <h2 className="author-name">{authorData.name}</h2>
                            <h4 className="author-role text-muted mb-3">{authorData.role}</h4>
                            <p className="author-description">{authorData.description}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card className="about-card h-100">
                        <Card.Body>
                            <h3 className="card-title mb-4">Наша миссия</h3>
                            <p className="mission-text">
                                Мы стремимся вдохновлять наших читателей и предоставлять им 
                                полезную информацию о моде, стиле жизни, кулинарии и других 
                                интересных темах. Наша цель - создавать контент, который 
                                будет полезен, интересен и актуален.
                            </p>
                            <h3 className="card-title mt-4 mb-4">Наши ценности</h3>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="value-item">
                                    <strong>Качество</strong> - Мы уделяем внимание каждой детали
                                </ListGroup.Item>
                                <ListGroup.Item className="value-item">
                                    <strong>Аутентичность</strong> - Мы пишем от души
                                </ListGroup.Item>
                                <ListGroup.Item className="value-item">
                                    <strong>Инновации</strong> - Мы всегда в поиске новых идей
                                </ListGroup.Item>
                                <ListGroup.Item className="value-item">
                                    <strong>Сообщество</strong> - Мы ценим наших читателей
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col xs={12}>
                    <h2 className="section-title text-center mb-4">Наши достижения</h2>
                    <Row className="g-4">
                        {stats.map((stat, index) => (
                            <Col key={index} xs={6} md={3}>
                                <Card className="stat-card text-center">
                                    <Card.Body>
                                        <div className="stat-number">{stat.number}</div>
                                        <div className="stat-label">{stat.label}</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col xs={12}>
                    <h2 className="section-title text-center mb-4">Почему выбирают нас</h2>
                    <Row className="g-4">
                        {features.map((feature, index) => (
                            <Col key={index} xs={12} sm={6} md={3}>
                                <Card className="feature-card h-100 text-center">
                                    <Card.Body>
                                        <div className="feature-icon mb-3">
                                            {feature.icon}
                                        </div>
                                        <Card.Title className="feature-title">
                                            {feature.title}
                                        </Card.Title>
                                        <Card.Text className="feature-description">
                                            {feature.description}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <Card className="contact-card">
                        <Card.Body className="text-center">
                            <h3 className="card-title mb-3">Свяжитесь с нами</h3>
                            <p className="contact-text mb-4">
                                У вас есть вопросы или предложения? Мы будем рады услышать от вас!
                            </p>
                            <a href="/contact" className="contact-link">
                                Перейти на страницу контактов
                            </a>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default About;
