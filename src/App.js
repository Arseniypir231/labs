import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Article from './pages/Article';
import Contact from './pages/Contact';
import menuData from './data/menu.json';
import appConfigData from './data/appConfig.json';
import './App.css';

const App = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [appConfig, setAppConfig] = useState(null);

    useEffect(() => {
        setMenuItems(menuData);
        setAppConfig(appConfigData);
    }, []);

    if (!appConfig) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div className="App">
                <article className="fashion">
                    <Header 
                        organizationName={appConfig.organizationName}
                        menuItems={menuItems}
                    />
                </article>
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/recipes" element={<Recipes />} />
                        <Route path="/article" element={<Article />} />
                        <Route path="/article/:id" element={<Article />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </main>
                <Footer 
                    organizationName={appConfig.organizationName}
                    menuItems={menuItems}
                    socialIcons={appConfig.socialIcons}
                    copyrightText={appConfig.copyrightText}
                />
            </div>
        </Router>
    );
};

export default App;
