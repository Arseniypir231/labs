import React from 'react';
import './Header.css';

class Header extends React.Component {
    render() {
        const { organizationName, menuItems } = this.props;
        
        return (
            <header className="fashion-header">
                <img src="/assets/Logotype.svg" alt="Logotype" />
                <nav>
                    <ul>
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                {index === 0 ? (
                                    <span className="homeSpan">{item}</span>
                                ) : (
                                    item
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>
        );
    }
}

export default Header;
