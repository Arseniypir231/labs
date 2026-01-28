import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './RecipeFormModal.css';

const RecipeFormModal = ({ isOpen, onClose, recipe, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        category: '',
        date: '',
        author: '',
        description: '',
        ingredients: [],
        prepTime: '',
        cookTime: ''
    });
    const [ingredientInput, setIngredientInput] = useState('');

    useEffect(() => {
        if (recipe) {
            setFormData({
                title: recipe.title || '',
                image: recipe.image || '',
                category: recipe.category || '',
                date: recipe.date || '',
                author: recipe.author || '',
                description: recipe.description || '',
                ingredients: recipe.ingredients || [],
                prepTime: recipe.prepTime || '',
                cookTime: recipe.cookTime || ''
            });
        } else {
            const today = new Date();
            const formattedDate = today.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            setFormData({
                title: '',
                image: '',
                category: '',
                date: formattedDate,
                author: 'Kate Willems',
                description: '',
                ingredients: [],
                prepTime: '',
                cookTime: ''
            });
        }
        setIngredientInput('');
    }, [recipe, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddIngredient = () => {
        if (ingredientInput.trim()) {
            setFormData(prev => ({
                ...prev,
                ingredients: [...prev.ingredients, ingredientInput.trim()]
            }));
            setIngredientInput('');
        }
    };

    const handleRemoveIngredient = (index) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, recipe ? recipe.id : null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="recipe-form-modal">
                <h2>{recipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Image URL</label>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Salad">Salad</option>
                            <option value="Main Course">Main Course</option>
                            <option value="Appetizer">Appetizer</option>
                            <option value="Beverage">Beverage</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="prepTime">Prep Time</label>
                            <input
                                type="text"
                                id="prepTime"
                                name="prepTime"
                                value={formData.prepTime}
                                onChange={handleChange}
                                placeholder="e.g., 30 min"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cookTime">Cook Time</label>
                            <input
                                type="text"
                                id="cookTime"
                                name="cookTime"
                                value={formData.cookTime}
                                onChange={handleChange}
                                placeholder="e.g., 45 min"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            type="text"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="author">Author</label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Ingredients</label>
                        <div className="ingredients-input">
                            <input
                                type="text"
                                value={ingredientInput}
                                onChange={(e) => setIngredientInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
                                placeholder="Add ingredient and press Enter"
                            />
                            <button type="button" onClick={handleAddIngredient} className="btn-add">
                                Add
                            </button>
                        </div>
                        <div className="ingredients-list">
                            {formData.ingredients.map((ingredient, index) => (
                                <span key={index} className="ingredient-tag">
                                    {ingredient}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveIngredient(index)}
                                        className="remove-ingredient"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-save">
                            {recipe ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default RecipeFormModal;
