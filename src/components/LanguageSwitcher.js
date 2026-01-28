import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' }
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    return (
        <Dropdown className="language-switcher">
            <Dropdown.Toggle variant="outline-secondary" size="sm" className="language-toggle">
                <FaGlobe className="me-1" />
                <span className="language-flag">{currentLanguage.flag}</span>
                <span className="language-name d-none d-md-inline">{currentLanguage.name}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {languages.map(lang => (
                    <Dropdown.Item
                        key={lang.code}
                        active={i18n.language === lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="language-item"
                    >
                        <span className="language-flag">{lang.flag}</span>
                        <span className="ms-2">{lang.name}</span>
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default LanguageSwitcher;
