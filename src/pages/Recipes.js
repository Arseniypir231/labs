import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import RecipeDetailModal from '../components/RecipeDetailModal';
import RecipeFormModal from '../components/RecipeFormModal';
import ManagementPanel from '../components/ManagementPanel';
import authorData from '../data/author.json';
import featuredPostsData from '../data/featuredPosts.json';
import categoriesData from '../data/categories.json';
import socialsData from '../data/socials.json';
import tagsData from '../data/tags.json';
import recipesData from '../data/recipes.json';
import './Recipes.css';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [author, setAuthor] = useState(null);
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [socials, setSocials] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [selectedRecipes, setSelectedRecipes] = useState(new Set());
    const [nextId, setNextId] = useState(100);

    useEffect(() => {
        const recipesWithType = recipesData.map((recipe, index) => ({
            ...recipe,
            id: recipe.id || index + 1,
            type: 'recipe'
        }));
        setRecipes(recipesWithType);
        setAuthor(authorData);
        setFeaturedPosts(featuredPostsData);
        setCategories(categoriesData);
        setSocials(socialsData);
        setTags(tagsData);
        setNextId(Math.max(...recipesWithType.map(r => r.id), 0) + 1);
    }, []);

    const handleRecipeClick = (recipe) => {
        if (selectedRecipes.size === 0) {
            setSelectedRecipe(recipe);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRecipe(null);
    };

    const handleRecipeSelect = (recipeId, isSelected) => {
        setSelectedRecipes(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(recipeId);
            } else {
                newSet.delete(recipeId);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        const allIds = recipes.map(recipe => recipe.id);
        setSelectedRecipes(new Set(allIds));
    };

    const handleDeselectAll = () => {
        setSelectedRecipes(new Set());
    };

    const handleAdd = () => {
        setEditingRecipe(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = () => {
        if (selectedRecipes.size === 1) {
            const recipeId = Array.from(selectedRecipes)[0];
            const recipe = recipes.find(r => r.id === recipeId);
            if (recipe) {
                setEditingRecipe(recipe);
                setIsFormModalOpen(true);
            }
        }
    };

    const handleDelete = () => {
        if (selectedRecipes.size > 0 && window.confirm(`Delete ${selectedRecipes.size} recipe(s)?`)) {
            setRecipes(prev => prev.filter(recipe => !selectedRecipes.has(recipe.id)));
            setSelectedRecipes(new Set());
        }
    };

    const handleSaveRecipe = (recipeData, recipeId) => {
        if (recipeId) {
            setRecipes(prev => prev.map(recipe => 
                recipe.id === recipeId ? { ...recipeData, id: recipeId } : recipe
            ));
        } else {
            const newRecipe = {
                ...recipeData,
                id: nextId
            };
            setRecipes(prev => [...prev, newRecipe]);
            setNextId(prev => prev + 1);
        }
        setIsFormModalOpen(false);
        setEditingRecipe(null);
    };

    if (!author) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <section className="recipes-page">
                <section className="recipes-content">
                    <h1 className="page-title">Recipes</h1>
                    <ManagementPanel
                        selectedCount={selectedRecipes.size}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSelectAll={handleSelectAll}
                        onDeselectAll={handleDeselectAll}
                        canEdit={true}
                        canDelete={true}
                        canSelectAll={true}
                    />
                    <section className="recipes-list">
                        {recipes.map((recipe) => (
                            <article 
                                key={recipe.id} 
                                className={`recipe-card ${selectedRecipes.has(recipe.id) ? 'selected' : ''}`}
                                onClick={() => handleRecipeClick(recipe)}
                            >
                                {selectedRecipes.has(recipe.id) && (
                                    <div className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            checked={true}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                handleRecipeSelect(recipe.id, false);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                )}
                                {!selectedRecipes.has(recipe.id) && (
                                    <div className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            checked={false}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                handleRecipeSelect(recipe.id, true);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                )}
                                <img src={recipe.image} alt={recipe.title} />
                                <div className="recipe-info">
                                    <h3 className="recipe-category">{recipe.category}</h3>
                                    <h2 className="recipe-title">{recipe.title}</h2>
                                    <article className="articleText">
                                        <h2>{recipe.date} <span>By</span> {recipe.author}</h2>
                                    </article>
                                    <p className="recipe-description">{recipe.description}</p>
                                    <div className="recipe-meta">
                                        <span>Prep: {recipe.prepTime}</span>
                                        <span>Cook: {recipe.cookTime}</span>
                                    </div>
                                    <div className="recipe-ingredients">
                                        <h4>Ingredients:</h4>
                                        <ul>
                                            {recipe.ingredients.map((ingredient, index) => (
                                                <li key={index}>{ingredient}</li>
                                            ))}
                                        </ul>
                                    </div>
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
            <RecipeDetailModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                recipe={selectedRecipe}
            />
            <RecipeFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setEditingRecipe(null);
                }}
                recipe={editingRecipe}
                onSave={handleSaveRecipe}
            />
        </>
    );
};

export default Recipes;
