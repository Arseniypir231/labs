import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = ({ organizationName, menuItems, socialIcons, copyrightText }) => {
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
        <footer>
            <img src="/assets/Logotype_footer.png" alt="Logotype_footer" className="footer_logo" />
            <nav className="footer_nav">
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <Link to={getMenuPath(item)}>{item}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <nav className="socials">
                <ul>
                    {socialIcons.map((icon, index) => (
                        <li key={index}>
                            <img src={icon} alt={`social_${index}`} />
                        </li>
                    ))}
                </ul>
            </nav>
            <hr />
            <h3>{copyrightText}</h3>
        </footer>
    );
};

export default Footer;
