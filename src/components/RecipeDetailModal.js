import React from 'react';
import Modal from './Modal';
import './RecipeDetailModal.css';

const RecipeDetailModal = ({ isOpen, onClose, recipe }) => {
    if (!recipe) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="recipe-detail-modal">
                <img src={recipe.image} alt={recipe.title} className="recipe-detail-image" />
                <div className="recipe-detail-content">
                    <h3 className="recipe-detail-category">{recipe.category}</h3>
                    <h2 className="recipe-detail-title">{recipe.title}</h2>
                    <article className="articleText">
                        <h2>{recipe.date} <span>By</span> {recipe.author}</h2>
                    </article>
                    <div className="recipe-detail-meta">
                        <span className="meta-item">Prep: {recipe.prepTime}</span>
                        <span className="meta-item">Cook: {recipe.cookTime}</span>
                    </div>
                    <p className="recipe-detail-description">{recipe.description}</p>
                    <div className="recipe-detail-ingredients">
                        <h4>Ingredients:</h4>
                        <ul>
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="recipe-detail-instructions">
                        <h4>Instructions:</h4>
                        <ol>
                            <li>Prepare all ingredients as listed above.</li>
                            <li>Follow the traditional cooking method for this recipe.</li>
                            <li>Cook until done, checking periodically.</li>
                            <li>Serve hot and enjoy!</li>
                        </ol>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default RecipeDetailModal;
