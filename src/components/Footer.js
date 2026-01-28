import React from 'react';
import './Footer.css';

class Footer extends React.Component {
    render() {
        const { organizationName, menuItems, socialIcons, copyrightText } = this.props;
        
        return (
            <footer>
                <img src="/assets/Logotype_footer.png" alt="Logotype_footer" className="footer_logo" />
                <nav className="footer_nav">
                    <ul>
                        {menuItems.map((item, index) => (
                            <li key={index}>{item}</li>
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
    }
}

export default Footer;
