import React from 'react';
import { Container, Row, Col, Image, Badge } from 'react-bootstrap';
import './Hero.css';

const Hero = ({ heroData }) => {
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
                                {heroData.category}
                            </Badge>
                            <h1 className="hero-title">{heroData.title}</h1>
                            <div className="hero-meta">
                                <span className="hero-meta-item">{heroData.date}</span>
                                <span className="hero-meta-item">
                                    <span className="meta-label">By</span> {heroData.author}
                                </span>
                                <span className="hero-meta-item">{heroData.comments} comments</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Hero;
