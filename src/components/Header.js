import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import { OverlayTrigger, Tooltip as BSTooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import './Header.css';

const Header = ({ organizationName, menuItems }) => {
    const location = useLocation();
    const { t } = useTranslation();
    
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
        <Navbar expand="lg" className="fashion-header" bg="light" variant="light">
            <Container fluid className="px-3 px-md-4 px-lg-5">
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <Image src="/assets/Logotype.svg" alt="Logotype" className="logo-img" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center" as="ul">
                        <Nav.Item as="li" className="me-2">
                            <LanguageSwitcher />
                        </Nav.Item>
                        <Nav.Item as="li" className="me-3">
                            <ThemeToggle />
                        </Nav.Item>
                        {menuItems.map((item, index) => {
                            const path = getMenuPath(item);
                            const isActive = location.pathname === path;
                            
                            // Получаем перевод для пункта меню
                            const menuKeyMap = {
                                'Home': 'navigation.home',
                                'Recipes': 'navigation.recipes',
                                'Article': 'navigation.article',
                                'Contact': 'navigation.contact',
                                'Search': 'navigation.search',
                                'Favorites': 'navigation.favorites',
                                'About': 'navigation.about'
                            };
                            const menuTranslationKey = menuKeyMap[item] || item;
                            const menuText = t(menuTranslationKey);
                            
                            const tooltip = (
                                <BSTooltip id={`tooltip-${index}`}>
                                    {t('footer.goToPage', { page: menuText })}
                                </BSTooltip>
                            );
                            
                            return (
                                <Nav.Item as="li" key={index} className="nav-item-custom">
                                    <OverlayTrigger placement="bottom" overlay={tooltip}>
                                        <Nav.Link 
                                            as={Link}
                                            to={path} 
                                            className={isActive ? 'active' : ''}
                                            eventKey={path}
                                        >
                                            {index === 0 ? (
                                                <span className="homeSpan">{menuText}</span>
                                            ) : (
                                                menuText
                                            )}
                                        </Nav.Link>
                                    </OverlayTrigger>
                                </Nav.Item>
                            );
                        })}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
