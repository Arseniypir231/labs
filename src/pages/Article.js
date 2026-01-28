import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ArticleDetailModal from '../components/ArticleDetailModal';
import ArticleFormModal from '../components/ArticleFormModal';
import ManagementPanel from '../components/ManagementPanel';
import authorData from '../data/author.json';
import featuredPostsData from '../data/featuredPosts.json';
import categoriesData from '../data/categories.json';
import socialsData from '../data/socials.json';
import tagsData from '../data/tags.json';
import articlesData from '../data/articles.json';
import './Article.css';

const Article = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [author, setAuthor] = useState(null);
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [socials, setSocials] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [selectedArticles, setSelectedArticles] = useState(new Set());
    const [nextId, setNextId] = useState(100);

    useEffect(() => {
        const articlesWithType = articlesData.map((article, index) => ({
            ...article,
            id: article.id || index + 1,
            type: 'article'
        }));
        setArticles(articlesWithType);
        setAuthor(authorData);
        setFeaturedPosts(featuredPostsData);
        setCategories(categoriesData);
        setSocials(socialsData);
        setTags(tagsData);
        setNextId(Math.max(...articlesWithType.map(a => a.id), 0) + 1);
    }, []);

    useEffect(() => {
        // Если есть ID в URL, открываем модальное окно
        if (id) {
            const article = articles.find(article => article.id === parseInt(id));
            if (article) {
                setSelectedArticle(article);
                setIsModalOpen(true);
            }
        }
    }, [id, articles]);

    if (!author) {
        return <div>Loading...</div>;
    }

    const handleArticleClick = (article) => {
        if (selectedArticles.size === 0) {
            setSelectedArticle(article);
            setIsModalOpen(true);
            navigate(`/article/${article.id}`);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedArticle(null);
        navigate('/article');
    };

    const handleArticleSelect = (articleId, isSelected) => {
        setSelectedArticles(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(articleId);
            } else {
                newSet.delete(articleId);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        const allIds = articles.map(article => article.id);
        setSelectedArticles(new Set(allIds));
    };

    const handleDeselectAll = () => {
        setSelectedArticles(new Set());
    };

    const handleAdd = () => {
        setEditingArticle(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = () => {
        if (selectedArticles.size === 1) {
            const articleId = Array.from(selectedArticles)[0];
            const article = articles.find(a => a.id === articleId);
            if (article) {
                setEditingArticle(article);
                setIsFormModalOpen(true);
            }
        }
    };

    const handleDelete = () => {
        if (selectedArticles.size > 0 && window.confirm(`Delete ${selectedArticles.size} article(s)?`)) {
            setArticles(prev => prev.filter(article => !selectedArticles.has(article.id)));
            setSelectedArticles(new Set());
        }
    };

    const handleSaveArticle = (articleData, articleId) => {
        if (articleId) {
            setArticles(prev => prev.map(article => 
                article.id === articleId ? { ...articleData, id: articleId } : article
            ));
        } else {
            const newArticle = {
                ...articleData,
                id: nextId
            };
            setArticles(prev => [...prev, newArticle]);
            setNextId(prev => prev + 1);
        }
        setIsFormModalOpen(false);
        setEditingArticle(null);
    };

    return (
        <>
            <section className="articles-page">
                <section className="articles-content">
                    <h1 className="page-title">Articles</h1>
                    <ManagementPanel
                        selectedCount={selectedArticles.size}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSelectAll={handleSelectAll}
                        onDeselectAll={handleDeselectAll}
                        canEdit={true}
                        canDelete={true}
                        canSelectAll={true}
                    />
                    <section className="articles-list">
                        {articles.map((article) => (
                            <article 
                                key={article.id} 
                                className={`article-card ${selectedArticles.has(article.id) ? 'selected' : ''}`}
                                onClick={() => handleArticleClick(article)}
                            >
                                {selectedArticles.has(article.id) && (
                                    <div className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            checked={true}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                handleArticleSelect(article.id, false);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                )}
                                {!selectedArticles.has(article.id) && (
                                    <div className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            checked={false}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                handleArticleSelect(article.id, true);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                )}
                                <img src={article.image} alt={article.title} />
                                <div className="article-info">
                                    <h3 className="article-category">{article.category}</h3>
                                    <h2 className="article-title">{article.title}</h2>
                                    <article className="articleText">
                                        <h2>{article.date} <span>By</span> {article.author}</h2>
                                        <h2 className="comments_h2">{article.comments} comments</h2>
                                    </article>
                                    <p className="article-preview">{article.content}</p>
                                </div>
                            </article>
                        ))}
                    </section>
                </section>
                <Sidebar 
                    author={author}
                    featuredPosts={featuredPosts}
                    categories={categories}
                    socials={socials}
                    tags={tags}
                />
            </section>
            <ArticleDetailModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                article={selectedArticle}
            />
            <ArticleFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setEditingArticle(null);
                }}
                article={editingArticle}
                onSave={handleSaveArticle}
            />
        </>
    );
};

export default Article;
