import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });
    
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode.toString());
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const toggleFavorite = (item) => {
        setFavorites(prev => {
            const exists = prev.find(fav => fav.id === item.id && fav.type === item.type);
            if (exists) {
                return prev.filter(fav => !(fav.id === item.id && fav.type === item.type));
            } else {
                return [...prev, { ...item, type: item.type || 'post' }];
            }
        });
    };

    const isFavorite = (id, type = 'post') => {
        return favorites.some(fav => fav.id === id && fav.type === type);
    };

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <AppContext.Provider value={{
            favorites,
            toggleFavorite,
            isFavorite,
            darkMode,
            toggleDarkMode
        }}>
            {children}
        </AppContext.Provider>
    );
};
