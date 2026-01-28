import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Tooltip from './Tooltip';
import './Header.css';

const Header = ({ organizationName, menuItems }) => {
    const location = useLocation();
    
    const getMenuPath = (item) => {
        const paths = {
            'Home': '/',
            'Recipes': '/recipes',
            'Article': '/article',
            'Contact': '/contact',
            'Purchase': '/purchase'
        };
        return paths[item] || '/';
    };
    
    return (
        <header className="fashion-header">
            <Link to="/">
                <img src="/assets/Logotype.svg" alt="Logotype" />
            </Link>
            <nav>
                <ul>
                        {menuItems.map((item, index) => {
                        const path = getMenuPath(item);
                        const isActive = location.pathname === path;
                        
                        return (
                            <li key={index}>
                                <Tooltip text={`Go to ${item} page`} position="bottom">
                                    <Link 
                                        to={path} 
                                        className={isActive ? 'active' : ''}
                                    >
                                        {index === 0 ? (
                                            <span className="homeSpan">{item}</span>
                                        ) : (
                                            item
                                        )}
                                    </Link>
                                </Tooltip>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
