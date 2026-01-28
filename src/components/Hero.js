import React from 'react';
import { Container, Row, Col, Image, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { translateCategory, translateContent } from '../utils/translations';
import './Hero.css';

const Hero = ({ heroData }) => {
    const { t } = useTranslation();
    
    return (
        <section className="hero-section">
            <Container fluid className="px-0">
                <Row className="g-0">
                    <Col xs={12} md={6} className="hero-image-col">
                        <div className="hero-image-wrapper">
                            <Image 
                                src={heroData.image} 
                                alt="heroImage" 
                                className="hero-image"
                                fluid
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={6} className="hero-text-col">
                        <div className="hero-text-wrapper">
                            <Badge bg="secondary" className="hero-category mb-3">
                                {translateCategory(t, heroData.category)}
                            </Badge>
                            <h1 className="hero-title">
                                {heroData.titleKey ? t(`content.${heroData.titleKey}`, { defaultValue: heroData.title }) : (heroData.title || translateContent(t, 'postTitle'))}
                            </h1>
                            <div className="hero-meta">
                                <span className="hero-meta-item">{heroData.dateKey ? t(`content.${heroData.dateKey}`, { defaultValue: heroData.date }) : (heroData.date || translateContent(t, 'date'))}</span>
                                <span className="hero-meta-item">
                                    <span className="meta-label">{t('hero.by')}</span> {heroData.authorKey ? t(`content.${heroData.authorKey}`, { defaultValue: heroData.author }) : (heroData.author || translateContent(t, 'author'))}
                                </span>
                                <span className="hero-meta-item">{heroData.comments} {t('hero.comments')}</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Hero;
