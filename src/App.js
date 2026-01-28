import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './store';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Article from './pages/Article';
import Contact from './pages/Contact';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import About from './pages/About';
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
        <Provider store={store}>
            <AppProvider>
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
                                <Route path="/search" element={<Search />} />
                                <Route path="/favorites" element={<Favorites />} />
                                <Route path="/about" element={<About />} />
                            </Routes>
                        </main>
                        <Footer 
                            organizationName={appConfig.organizationName}
                            menuItems={menuItems}
                            socialIcons={appConfig.socialIcons}
                            copyrightText={appConfig.copyrightText}
                        />
                        <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        />
                    </div>
                </Router>
            </AppProvider>
        </Provider>
    );
};

export default App;
