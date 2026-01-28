import React from 'react';
import { Button } from 'react-bootstrap';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { darkMode, toggleDarkMode } = useApp();

    return (
        <Button
            variant="outline-secondary"
            size="sm"
            onClick={toggleDarkMode}
            className="theme-toggle-btn"
            title={darkMode ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
        >
            {darkMode ? <FaSun /> : <FaMoon />}
        </Button>
    );
};

export default ThemeToggle;
