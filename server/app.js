const express = require('express');
const cors = require('cors');
const path = require('path');
const postsRouter = require('./routes/posts');
const dataRouter = require('./routes/data');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы (React build)
app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

// API Routes
app.use('/api/posts', postsRouter);
app.use('/api/data', dataRouter);

/**
 * GET / - Возвращает веб-страницу с фронтенд-кодом (React)
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

/**
 * GET /api-demo.html - Возвращает HTML страницу для демонстрации API
 */
app.get('/api-demo.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/api-demo.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Обработка 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Запуск сервера
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

// Обработка ошибки порта
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
        console.error('Please stop the process using this port or change the PORT environment variable.');
        console.error(`To find the process: netstat -ano | findstr :${PORT}`);
        process.exit(1);
    } else {
        throw err;
    }
});

module.exports = app;
