import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Nav, Image, ListGroup } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './Footer.css';

const Footer = ({ organizationName, menuItems, socialIcons, copyrightText }) => {
    const getMenuPath = (item) => {
        const paths = {
            'Home': '/',
            'Recipes': '/recipes',
            'Article': '/article',
            'Contact': '/contact',
            'Search': '/search',
            'Favorites': '/favorites',
            'About': '/about'
        };
        return paths[item] || '/';
    };
    
    return (
        <footer className="footer-custom">
            <Container fluid className="px-3 px-md-4 px-lg-5">
                <Row className="align-items-center justify-content-center text-center mb-3">
                    <Col xs={12} className="mb-3 mb-md-0">
                        <Image 
                            src="/assets/Logotype_footer.png" 
                            alt="Logotype_footer" 
                            className="footer_logo" 
                            fluid
                        />
                    </Col>
                </Row>
                <Row className="justify-content-center mb-3">
                    <Col xs={12} md="auto">
                        <Nav className="footer_nav justify-content-center flex-wrap" as="ul">
                            {menuItems.map((item, index) => (
                                <Nav.Item as="li" key={index} className="footer-nav-item">
                                    <Nav.Link 
                                        as={Link} 
                                        to={getMenuPath(item)}
                                        className="footer-nav-link"
                                    >
                                        {item}
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                    </Col>
                </Row>
                <Row className="justify-content-center mb-3">
                    <Col xs={12} md="auto">
                        <ListGroup horizontal className="socials-list">
                            {socialIcons.map((icon, index) => {
                                const tooltip = (
                                    <Tooltip id={`social-tooltip-${index}`}>
                                        Social media {index + 1}
                                    </Tooltip>
                                );
                                
                                return (
                                    <OverlayTrigger 
                                        key={index} 
                                        placement="top" 
                                        overlay={tooltip}
                                    >
                                        <ListGroup.Item className="social-item">
                                            <Image 
                                                src={icon} 
                                                alt={`social_${index}`} 
                                                className="social-icon"
                                                fluid
                                            />
                                        </ListGroup.Item>
                                    </OverlayTrigger>
                                );
                            })}
                        </ListGroup>
                    </Col>
                </Row>
                <hr className="footer-divider" />
                <Row>
                    <Col xs={12} className="text-center">
                        <h3 className="footer-copyright">{copyrightText}</h3>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
