import React from 'react';
import { Container, Row, Col, Card, Image, ListGroup } from 'react-bootstrap';
import { FaUsers, FaAward, FaRocket, FaHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import authorData from '../data/author.json';
import './About.css';

const About = () => {
    const { t } = useTranslation();
    
    const features = [
        {
            icon: <FaUsers />,
            title: t('about.team'),
            description: t('about.teamDesc')
        },
        {
            icon: <FaAward />,
            title: t('about.quality'),
            description: t('about.qualityDesc')
        },
        {
            icon: <FaRocket />,
            title: t('about.innovation'),
            description: t('about.innovationDesc')
        },
        {
            icon: <FaHeart />,
            title: t('about.passion'),
            description: t('about.passionDesc')
        }
    ];

    const stats = [
        { number: '1000+', label: t('about.articles') },
        { number: '500+', label: t('about.recipes') },
        { number: '50+', label: t('about.authors') },
        { number: '10K+', label: t('about.readers') }
    ];

    return (
        <Container fluid className="about-page px-3 px-md-4 px-lg-5">
            <Row>
                <Col xs={12}>
                    <div className="about-hero mb-5">
                        <h1 className="about-title">{t('about.title')}</h1>
                        <p className="about-subtitle">
                            {t('about.subtitle')}
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
                            <h3 className="card-title mb-4">{t('about.mission')}</h3>
                            <p className="mission-text">
                                {t('about.missionText')}
                            </p>
                            <h3 className="card-title mt-4 mb-4">{t('about.values')}</h3>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="value-item">
                                    <strong>{t('about.quality')}</strong> - {t('about.qualityValue').split(' - ')[1]}
                                </ListGroup.Item>
                                <ListGroup.Item className="value-item">
                                    <strong>{t('about.authenticity')}</strong> - {t('about.authenticityValue').split(' - ')[1]}
                                </ListGroup.Item>
                                <ListGroup.Item className="value-item">
                                    <strong>{t('about.innovation')}</strong> - {t('about.innovationValue').split(' - ')[1]}
                                </ListGroup.Item>
                                <ListGroup.Item className="value-item">
                                    <strong>{t('about.community')}</strong> - {t('about.communityValue').split(' - ')[1]}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col xs={12}>
                    <h2 className="section-title text-center mb-4">{t('about.achievements')}</h2>
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
                    <h2 className="section-title text-center mb-4">{t('about.whyChooseUs')}</h2>
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
                            <h3 className="card-title mb-3">{t('about.contactUs')}</h3>
                            <p className="contact-text mb-4">
                                {t('about.contactText')}
                            </p>
                            <a href="/contact" className="contact-link">
                                {t('about.goToContact')}
                            </a>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default About;
