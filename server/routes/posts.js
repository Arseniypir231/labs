const express = require('express');
const router = express.Router();
const { readJsonFile, writeJsonFile } = require('../utils/fileUtils');

/**
 * GET /api/posts - Получить все посты
 */
router.get('/', async (req, res) => {
    try {
        const posts = await readJsonFile('posts.json');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/posts/:id - Получить пост по ID
 */
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const posts = await readJsonFile('posts.json');
        const post = posts.find(p => p.id === id);
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/posts - Создать новый пост
 */
router.post('/', async (req, res) => {
    try {
        const { image, alt, category, title, date, author, comments, description } = req.body;
        
        // Валидация обязательных полей
        if (!image || !category || !title || !date || !author) {
            return res.status(400).json({ 
                error: 'Missing required fields: image, category, title, date, author' 
            });
        }
        
        const posts = await readJsonFile('posts.json');
        
        // Генерируем новый ID
        const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
        
        const newPost = {
            id: newId,
            image,
            alt: alt || `post_${newId}`,
            category,
            title,
            date,
            author,
            ...(comments !== undefined && { comments }),
            ...(description && { description })
        };
        
        posts.push(newPost);
        await writeJsonFile('posts.json', posts);
        
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/posts/search - Поиск постов (возвращает данные)
 */
router.post('/search', async (req, res) => {
    try {
        const { query, category, author } = req.body;
        const posts = await readJsonFile('posts.json');
        
        let filteredPosts = [...posts];
        
        // Фильтрация по поисковому запросу
        if (query) {
            const searchQuery = query.toLowerCase();
            filteredPosts = filteredPosts.filter(post => 
                post.title?.toLowerCase().includes(searchQuery) ||
                post.description?.toLowerCase().includes(searchQuery) ||
                post.category?.toLowerCase().includes(searchQuery)
            );
        }
        
        // Фильтрация по категории
        if (category) {
            filteredPosts = filteredPosts.filter(post => 
                post.category === category
            );
        }
        
        // Фильтрация по автору
        if (author) {
            filteredPosts = filteredPosts.filter(post => 
                post.author === author
            );
        }
        
        res.json({
            count: filteredPosts.length,
            results: filteredPosts
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/posts/:id - Удалить пост
 */
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const posts = await readJsonFile('posts.json');
        
        const postIndex = posts.findIndex(p => p.id === id);
        
        if (postIndex === -1) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        const deletedPost = posts.splice(postIndex, 1)[0];
        await writeJsonFile('posts.json', posts);
        
        res.json({ 
            message: 'Post deleted successfully',
            deletedPost 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
