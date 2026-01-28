import React from 'react';
import { Button } from 'react-bootstrap';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleDarkMode } from '../store/slices/uiStateSlice';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const darkMode = useAppSelector((state) => state.uiState.darkMode);
    const dispatch = useAppDispatch();

    const handleToggle = () => {
        dispatch(toggleDarkMode());
    };

    return (
        <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleToggle}
            className="theme-toggle-btn"
            title={darkMode ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
        >
            {darkMode ? <FaSun /> : <FaMoon />}
        </Button>
    );
};

export default ThemeToggle;
