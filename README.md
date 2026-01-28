# Система управления транспортной логистикой

Веб-приложение с многоуровневой архитектурой на основе стека PERN (PostgreSQL, Express, React, Node.js).

## Структура проекта

```
├── server/          # Backend (Node.js + Express + Sequelize)
│   ├── config/      # Конфигурация базы данных
│   ├── controllers/ # Контроллеры для обработки запросов
│   ├── models/      # Модели Sequelize
│   ├── routes/      # Маршруты API
│   └── index.js     # Точка входа сервера
├── client/          # Frontend (React)
│   ├── public/      # Статические файлы
│   └── src/         # Исходный код React
│       ├── components/ # React компоненты
│       └── services/  # API сервисы
└── package.json     # Корневой package.json
```

## Требования

- Node.js (версия 14 или выше)
- PostgreSQL (версия 12 или выше)
- npm или yarn

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd labs
```

### 2. Установка зависимостей

```bash
# Установка зависимостей для всего проекта
npm run install-all

# Или отдельно для сервера и клиента
npm run install-server
npm run install-client
```

### 3. Настройка базы данных PostgreSQL

Убедитесь, что PostgreSQL запущен на порту 5432. Создайте базу данных:

```sql
CREATE DATABASE transport_logistics;
```

### 4. Настройка переменных окружения

Создайте файл `server/.env` на основе `server/.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=transport_logistics
DB_USER=postgres
DB_PASSWORD=postgres
PORT=5000
```

### 5. Запуск приложения

```bash
# Запуск сервера и клиента одновременно
npm run dev

# Или отдельно:
npm run server  # Запуск только сервера на http://localhost:5000
npm run client  # Запуск только клиента на http://localhost:3000
```

При первом запуске сервер автоматически создаст таблицы в базе данных.

## API Endpoints

### Транспортные средства (Vehicles)

- `POST /api/vehicles` - Создание нового транспортного средства
- `GET /api/vehicles` - Получение списка с пагинацией, сортировкой, фильтрацией и поиском
- `GET /api/vehicles/:id` - Получение транспортного средства по ID
- `PUT /api/vehicles/:id` - Обновление транспортного средства
- `DELETE /api/vehicles/:id` - Удаление транспортного средства
- `GET /api/vehicles/:id/exists` - Проверка существования транспортного средства

**Параметры запроса для GET /api/vehicles:**
- `page` - номер страницы (по умолчанию: 1)
- `limit` - количество записей на странице (по умолчанию: 10)
- `sortBy` - поле для сортировки (id, licensePlate, brand, model, vehicleType, capacity, status, year)
- `sortOrder` - порядок сортировки (ASC или DESC)
- `search` - поиск по номерному знаку, марке, модели
- `status` - фильтр по статусу (available, in_use, maintenance, retired)
- `vehicleType` - фильтр по типу (truck, van, car, motorcycle)
- `minCapacity` - минимальная грузоподъемность
- `maxCapacity` - максимальная грузоподъемность
- `minYear` - минимальный год выпуска
- `maxYear` - максимальный год выпуска

### Маршруты (Routes)

- `POST /api/routes` - Создание нового маршрута
- `GET /api/routes` - Получение списка с пагинацией, сортировкой, фильтрацией и поиском
- `GET /api/routes/:id` - Получение маршрута по ID
- `PUT /api/routes/:id` - Обновление маршрута
- `DELETE /api/routes/:id` - Удаление маршрута
- `GET /api/routes/:id/exists` - Проверка существования маршрута

**Параметры запроса для GET /api/routes:**
- `page`, `limit`, `sortBy`, `sortOrder` - аналогично Vehicles
- `search` - поиск по названию, точке отправления, точке назначения
- `status` - фильтр по статусу (active, inactive, archived)
- `origin` - фильтр по точке отправления
- `destination` - фильтр по точке назначения
- `minDistance` - минимальное расстояние
- `maxDistance` - максимальное расстояние
- `minTime` - минимальное время в минутах
- `maxTime` - максимальное время в минутах

### Грузоперевозки (Shipments)

- `POST /api/shipments` - Создание новой грузоперевозки
- `GET /api/shipments` - Получение списка с пагинацией, сортировкой, фильтрацией и поиском
- `GET /api/shipments/:id` - Получение грузоперевозки по ID
- `PUT /api/shipments/:id` - Обновление грузоперевозки
- `DELETE /api/shipments/:id` - Удаление грузоперевозки
- `GET /api/shipments/:id/exists` - Проверка существования грузоперевозки

**Параметры запроса для GET /api/shipments:**
- `page`, `limit`, `sortBy`, `sortOrder` - аналогично Vehicles
- `search` - поиск по описанию груза
- `status` - фильтр по статусу (pending, in_transit, delivered, cancelled)
- `vehicleId` - фильтр по ID транспортного средства
- `routeId` - фильтр по ID маршрута
- `minWeight` - минимальный вес
- `maxWeight` - максимальный вес
- `departureDateFrom` - дата отправления от (формат: YYYY-MM-DD)
- `departureDateTo` - дата отправления до (формат: YYYY-MM-DD)

## Модели базы данных

### Vehicle (Транспортные средства)
- `id` - уникальный идентификатор
- `licensePlate` - номерной знак (уникальный)
- `brand` - марка
- `model` - модель
- `vehicleType` - тип (truck, van, car, motorcycle)
- `capacity` - грузоподъемность (тонны)
- `status` - статус (available, in_use, maintenance, retired)
- `year` - год выпуска
- `createdAt`, `updatedAt` - временные метки

### Route (Маршруты)
- `id` - уникальный идентификатор
- `name` - название маршрута
- `origin` - точка отправления
- `destination` - точка назначения
- `distance` - расстояние (км)
- `estimatedTime` - оценочное время (минуты)
- `status` - статус (active, inactive, archived)
- `createdAt`, `updatedAt` - временные метки

### Shipment (Грузоперевозки)
- `id` - уникальный идентификатор
- `vehicleId` - ID транспортного средства (внешний ключ)
- `routeId` - ID маршрута (внешний ключ)
- `cargoDescription` - описание груза
- `weight` - вес (тонны)
- `status` - статус (pending, in_transit, delivered, cancelled)
- `departureDate` - дата отправления
- `deliveryDate` - дата доставки
- `createdAt`, `updatedAt` - временные метки

## Валидация данных

Все модели используют встроенные и пользовательские валидаторы Sequelize:
- Проверка обязательных полей
- Проверка типов данных
- Проверка диапазонов значений
- Проверка уникальности
- Пользовательские валидаторы для бизнес-логики

## Тестирование API

Для тестирования API можно использовать Postman. Импортируйте коллекцию из файла `postman_collection.json` или создайте запросы вручную.

Примеры запросов:

**Создание транспортного средства:**
```json
POST http://localhost:5000/api/vehicles
Content-Type: application/json

{
  "licensePlate": "А123БВ777",
  "brand": "Mercedes",
  "model": "Actros",
  "vehicleType": "truck",
  "capacity": 20.5,
  "status": "available",
  "year": 2020
}
```

**Получение списка с фильтрацией:**
```
GET http://localhost:5000/api/vehicles?status=available&vehicleType=truck&page=1&limit=10&sortBy=year&sortOrder=DESC
```

## Особенности реализации

1. **CRUD операции** - полный набор операций для всех сущностей
2. **Пагинация** - поддержка разбиения результатов на страницы
3. **Сортировка** - сортировка по любому полю в порядке возрастания или убывания
4. **Фильтрация** - фильтрация по одному или нескольким полям одновременно
5. **Поиск** - поиск по нескольким полям одновременно с использованием LIKE запросов
6. **Валидация** - валидация на уровне моделей с понятными сообщениями об ошибках
7. **Обработка ошибок** - корректная обработка случаев отсутствия записей и других ошибок
8. **Связи между моделями** - использование внешних ключей и связей Sequelize

## История коммитов

Проект ведется с использованием конвенции коммитов:
- `init` - инициализация проекта
- `feat` - новая функциональность
- `refactor` - рефакторинг кода
- `fix` - исправление ошибок
- `docs` - обновление документации
