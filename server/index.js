const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const { Vehicle, Route, Shipment, User } = require('./models');
const { authenticate, authorize } = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public routes (авторизация)
app.use('/api/auth', require('./routes/authRoutes'));

// Protected routes (требуют аутентификации)
app.use('/api/vehicles', authenticate, require('./routes/vehicleRoutes'));
app.use('/api/routes', authenticate, require('./routes/routeRoutes'));
app.use('/api/shipments', authenticate, require('./routes/shipmentRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Что-то пошло не так!' });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Проверка подключения к базе данных
    await sequelize.authenticate();
    console.log('Подключение к базе данных установлено успешно.');

    // Синхронизация моделей с базой данных (создание таблиц)
    await sequelize.sync({ alter: true });
    console.log('Модели синхронизированы с базой данных.');

    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка при запуске сервера:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
