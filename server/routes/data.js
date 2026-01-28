const express = require('express');
const router = express.Router();
const { readJsonFile } = require('../utils/fileUtils');
const xml2js = require('xml2js');

/**
 * GET /api/data - Возвращает данные в формате JSON/XML/HTML в зависимости от Accept заголовка
 */
router.get('/', async (req, res) => {
    try {
        const acceptHeader = req.headers.accept || 'application/json';
        const posts = await readJsonFile('posts.json');
        
        // Определяем формат на основе Accept заголовка
        if (acceptHeader.includes('application/xml') || acceptHeader.includes('text/xml')) {
            // XML формат
            const builder = new xml2js.Builder({ rootName: 'posts' });
            const xml = builder.buildObject({ post: posts });
            res.setHeader('Content-Type', 'application/xml');
            res.send(xml);
        } else if (acceptHeader.includes('text/html')) {
            // HTML формат
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Posts Data</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .post { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
                        .post-title { font-size: 18px; font-weight: bold; color: #333; }
                        .post-meta { color: #666; font-size: 14px; margin-top: 5px; }
                        .post-category { display: inline-block; background: #007bff; color: white; padding: 3px 8px; border-radius: 3px; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <h1>Posts Data</h1>
                    <p>Total posts: ${posts.length}</p>
                    ${posts.map(post => `
                        <div class="post">
                            <span class="post-category">${post.category}</span>
                            <div class="post-title">${post.title}</div>
                            <div class="post-meta">
                                ${post.date} | Author: ${post.author}
                                ${post.comments ? ` | ${post.comments} comments` : ''}
                            </div>
                            ${post.description ? `<p>${post.description}</p>` : ''}
                        </div>
                    `).join('')}
                </body>
                </html>
            `;
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        } else {
            // JSON формат (по умолчанию)
            res.json({
                count: posts.length,
                posts: posts
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
