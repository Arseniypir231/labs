-- SQL скрипт для создания таблицы users и добавления тестовых пользователей
-- Этот скрипт должен быть выполнен после создания основных таблиц

-- Создание таблицы users (если еще не создана через Sequelize sync)
-- CREATE TABLE IF NOT EXISTS users (
--   id SERIAL PRIMARY KEY,
--   email VARCHAR(100) UNIQUE NOT NULL,
--   password VARCHAR(255) NOT NULL,
--   first_name VARCHAR(50) NOT NULL,
--   last_name VARCHAR(50) NOT NULL,
--   role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
--   is_active BOOLEAN NOT NULL DEFAULT true,
--   password_reset_token VARCHAR(255),
--   password_reset_expires TIMESTAMP,
--   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- Вставка тестовых пользователей
-- Пароли хешируются через bcrypt, поэтому здесь используются уже хешированные пароли
-- Пароль для всех тестовых пользователей: "password123"
-- Хеш для "password123": $2a$10$rOzJqZqZqZqZqZqZqZqZqO (пример, реальный хеш будет сгенерирован при создании)

-- ВАЖНО: Эти пароли должны быть хешированы через bcrypt перед вставкой
-- Для тестирования можно использовать временные пароли или создать пользователей через API

-- Пример создания пользователя через API:
-- POST http://localhost:5000/api/auth/register
-- {
--   "email": "admin@test.com",
--   "password": "password123",
--   "firstName": "Администратор",
--   "lastName": "Системы",
--   "role": "admin"
-- }

-- Тестовые пользователи для создания через API:

-- 1. Администратор
-- Email: admin@test.com
-- Password: password123
-- Role: admin

-- 2. Менеджер
-- Email: manager@test.com
-- Password: password123
-- Role: manager

-- 3. Обычный пользователь
-- Email: user@test.com
-- Password: password123
-- Role: user

-- Примечание: Для безопасности пароли должны быть хешированы через bcrypt
-- Sequelize автоматически хеширует пароли при создании через модель User
