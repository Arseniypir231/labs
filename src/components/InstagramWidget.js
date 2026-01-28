import React from 'react';
import { Container, Row, Col, Image, Alert } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './InstagramWidget.css';

const InstagramWidget = ({ instagramImages, instagramName }) => {
    const { t } = useTranslation();
    
    return (
        <section className="instagram-widget-section">
            <Container fluid className="px-3 px-md-4 px-lg-5">
                <Row>
                    <Col xs={12} className="text-center mb-4">
                        <Alert variant="info" className="instagram-alert">
                            <h2 className="instagram-title">{t('instagram.followUs', { name: instagramName })}</h2>
                        </Alert>
                    </Col>
                </Row>
                <Row className="g-2 g-md-3">
                    {instagramImages.map((image, index) => {
                        const tooltip = (
                            <Tooltip id={`instagram-tooltip-${index}`}>
                                {t('instagram.post', { index: index + 1 })}
                            </Tooltip>
                        );
                        
                        return (
                            <Col key={index} xs={6} sm={4} md={3} lg={2}>
                                <OverlayTrigger placement="top" overlay={tooltip}>
                                    <div className="instagram-image-wrapper">
                                        <Image 
                                            src={image} 
                                            alt={`widget_pic_${index + 1}`}
                                            className="instagram-image"
                                            fluid
                                            rounded
                                        />
                                    </div>
                                </OverlayTrigger>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </section>
    );
};

export default InstagramWidget;
