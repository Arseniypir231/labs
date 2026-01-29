# Transport Logistics REST API

Веб-приложение для управления транспортной логистикой с использованием MongoDB, Mongoose ODM и Express.js.

## Технологии

- **Node.js** - серверная платформа
- **Express.js** - веб-фреймворк
- **MongoDB** - нереляционная база данных
- **Mongoose** - ODM для MongoDB

## Требования

Перед началом работы убедитесь, что установлены:

- **Node.js** (версия 16 или выше)
- **MongoDB** (локально или удаленно)
- **npm** или **yarn**

## Полная инструкция по установке и запуску

### Шаг 1: Клонирование и подготовка проекта

```bash
# Перейдите в директорию проекта
cd labs

# Убедитесь, что вы находитесь в корневой директории проекта
```

### Шаг 2: Установка зависимостей сервера

```bash
# Установите все зависимости для серверной части
npm install
```

Это установит следующие пакеты:
- express
- mongoose
- dotenv
- cors
- multer

### Шаг 3: Настройка переменных окружения

Создайте файл `.env` в корневой директории проекта:

```bash
# Windows (PowerShell)
New-Item .env

# Linux/Mac
touch .env
```

Откройте файл `.env` и добавьте следующие переменные:

**Для локального MongoDB:**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/transport_logistics
```

**Если используете локальный MongoDB:**

**Windows:**
```bash
# Если MongoDB установлен как служба, он должен запускаться автоматически
# Или запустите вручную:
net start MongoDB
```

**Linux:**
```bash
sudo systemctl start mongod
# или
sudo service mongod start
```

**Mac:**
```bash
brew services start mongodb-community
```

**Проверка подключения (только для локального MongoDB):**
```bash
# Проверьте, что MongoDB запущен
mongosh
# или
mongo
```


**Для разработки (с автоматической перезагрузкой):**
```bash
npm run dev
```

**Для продакшена:**
```bash
npm start
```

Вы должны увидеть сообщение:
```
MongoDB Connected: localhost:27017
Server is running on port 3000
```

**Проверка работы сервера:**
Откройте браузер и перейдите на `http://localhost:3000/api/health`

Ожидаемый ответ:
```json
{
  "status": "OK",
  "message": "Transport Logistics API is running"
}
```

### Шаг 6: Установка зависимостей клиента

Откройте **новый терминал** (сервер должен продолжать работать) и выполните:

```bash
# Перейдите в директорию client
cd client

# Установите зависимости клиентской части
npm install
```

Это установит:
- react
- react-dom
- react-router-dom
- @reduxjs/toolkit
- react-redux
- axios
- react-hook-form
- react-toastify
- vite

### Шаг 7: Запуск клиентского приложения

В том же терминале (где вы установили зависимости клиента):

```bash
npm run dev
```

Вы должны увидеть:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3001/
  ➜  Network: use --host to expose
```

### Шаг 8: Открытие приложения в браузере

Откройте браузер и перейдите на:
```
http://localhost:3001
```

Вы должны увидеть главную страницу приложения с навигацией.

## Структура запущенных процессов

После успешного запуска у вас должно быть **3 запущенных процесса**:

1. **MongoDB** - база данных (порт 27017)
2. **Express сервер** - API (порт 3000)
3. **Vite dev server** - React приложение (порт 3001)

## Остановка приложения

Для остановки нажмите `Ctrl+C` в каждом терминале, где запущены процессы.

## Решение проблем

### Проблема: MongoDB не запускается

**Решение:**
- Убедитесь, что MongoDB установлен
- Проверьте, что порт 27017 не занят другим процессом
- Проверьте логи MongoDB

### Проблема: Ошибка подключения к MongoDB

**Для локального MongoDB:**
- Проверьте правильность `MONGODB_URI` в файле `.env`
- Убедитесь, что MongoDB запущен
- Проверьте права доступа к базе данных

**Для MongoDB Atlas:**
- **Ошибка "IP not whitelisted":**
  - Откройте MongoDB Atlas Dashboard
  - Перейдите в "Network Access"
  - Добавьте ваш текущий IP адрес
  - Подождите 1-2 минуты и попробуйте снова
  
- **Ошибка "authentication failed":**
  - Проверьте правильность username и password в строке подключения
  - Убедитесь, что пользователь создан в "Database Access"
  
- **Ошибка "ENOTFOUND" или "getaddrinfo":**
  - Проверьте правильность hostname в строке подключения
  - Убедитесь, что строка подключения начинается с `mongodb+srv://`
  
- **Общий формат строки подключения для Atlas:**
  ```
  mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
  ```

### Проблема: Порт 3000 уже занят

**Решение:**
- Измените `PORT` в файле `.env` на другой порт (например, 3001)
- Или остановите процесс, использующий порт 3000

### Проблема: Клиент не может подключиться к серверу

**Решение:**
- Убедитесь, что сервер запущен на порту 3000
- Проверьте настройки прокси в `client/vite.config.js`
- Убедитесь, что CORS настроен правильно на сервере

## Структура базы данных

База данных состоит из 3 коллекций:

### 1. Vehicles (Транспортные средства)
- `licensePlate` - номерной знак (уникальный, валидация формата)
- `brand` - марка
- `model` - модель
- `year` - год выпуска
- `vehicleType` - тип (truck, van, car, trailer)
- `capacity` - грузоподъемность
- `capacityUnit` - единица измерения (kg, tons, cubic_meters)
- `status` - статус (available, in_use, maintenance, out_of_service)
- `mileage` - пробег
- `lastMaintenanceDate` - дата последнего ТО

### 2. Drivers (Водители)
- `firstName` - имя
- `lastName` - фамилия
- `phone` - телефон (уникальный, валидация формата)
- `email` - email (уникальный)
- `licenseNumber` - номер водительского удостоверения (уникальный)
- `licenseCategory` - категории прав (B, C, CE, D, DE)
- `experience` - опыт работы (лет)
- `status` - статус (available, on_delivery, sick_leave, vacation)
- `hireDate` - дата найма
- `address` - адрес (street, city, zipCode)

### 3. Deliveries (Доставки)
- `deliveryNumber` - номер доставки (уникальный, автогенерация)
- `driver` - ссылка на водителя (ObjectId)
- `vehicle` - ссылка на транспорт (ObjectId)
- `origin` - точка отправления (address, city, coordinates)
- `destination` - точка назначения (address, city, coordinates)
- `cargo` - груз (description, weight, weightUnit, volume, volumeUnit)
- `scheduledDate` - запланированная дата
- `actualStartDate` - фактическая дата начала
- `actualEndDate` - фактическая дата окончания
- `status` - статус (scheduled, in_transit, delivered, cancelled, delayed)
- `distance` - расстояние
- `cost` - стоимость
- `notes` - примечания

## API Endpoints

### Vehicles (Транспортные средства)

#### Создать транспорт
```
POST /api/vehicles
Content-Type: application/json

{
  "licensePlate": "А123БВ777",
  "brand": "Камаз",
  "model": "65117",
  "year": 2020,
  "vehicleType": "truck",
  "capacity": 10000,
  "capacityUnit": "kg",
  "status": "available"
}
```

#### Получить список транспорта
```
GET /api/vehicles?page=1&limit=10&sort=year&order=desc
```

**Параметры запроса:**
- `page` - номер страницы (по умолчанию: 1)
- `limit` - количество записей на странице (по умолчанию: 10)
- `sort` - поле для сортировки (по умолчанию: createdAt)
- `order` - порядок сортировки: asc или desc (по умолчанию: desc)
- `search` - поиск по licensePlate, brand, model
- `brand` - фильтр по марке
- `model` - фильтр по модели
- `vehicleType` - фильтр по типу
- `status` - фильтр по статусу
- `year` - фильтр по году
- `minCapacity` - минимальная грузоподъемность
- `maxCapacity` - максимальная грузоподъемность

**Примеры:**
```
GET /api/vehicles?search=камаз&status=available
GET /api/vehicles?vehicleType=truck&minCapacity=5000&maxCapacity=15000
GET /api/vehicles?sort=year&order=asc&page=2&limit=5
```

#### Получить транспорт по ID
```
GET /api/vehicles/:id
```

#### Проверить существование транспорта
```
GET /api/vehicles/:id/exists
```

#### Обновить транспорт
```
PUT /api/vehicles/:id
Content-Type: application/json

{
  "status": "maintenance",
  "mileage": 50000
}
```

#### Удалить транспорт
```
DELETE /api/vehicles/:id
```

### Drivers (Водители)

#### Создать водителя
```
POST /api/drivers
Content-Type: application/json

{
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79123456789",
  "email": "ivan@example.com",
  "licenseNumber": "77АВ123456",
  "licenseCategory": ["C", "CE"],
  "experience": 5,
  "status": "available",
  "hireDate": "2020-01-15",
  "address": {
    "city": "Москва",
    "street": "Ленина, 1"
  }
}
```

#### Получить список водителей
```
GET /api/drivers?page=1&limit=10&sort=lastName&order=asc
```

**Параметры запроса:**
- `page`, `limit`, `sort`, `order` - пагинация и сортировка
- `search` - поиск по firstName, lastName, email, phone, licenseNumber
- `firstName` - фильтр по имени
- `lastName` - фильтр по фамилии
- `status` - фильтр по статусу
- `licenseCategory` - фильтр по категории прав
- `minExperience` - минимальный опыт
- `maxExperience` - максимальный опыт
- `city` - фильтр по городу

**Примеры:**
```
GET /api/drivers?search=иванов&status=available
GET /api/drivers?licenseCategory=C&minExperience=3
GET /api/drivers?city=Москва&sort=experience&order=desc
```

#### Получить водителя по ID
```
GET /api/drivers/:id
```

#### Проверить существование водителя
```
GET /api/drivers/:id/exists
```

#### Обновить водителя
```
PUT /api/drivers/:id
Content-Type: application/json

{
  "status": "on_delivery"
}
```

#### Удалить водителя
```
DELETE /api/drivers/:id
```

### Deliveries (Доставки)

#### Создать доставку
```
POST /api/deliveries
Content-Type: application/json

{
  "driver": "507f1f77bcf86cd799439011",
  "vehicle": "507f1f77bcf86cd799439012",
  "origin": {
    "address": "ул. Ленина, 1",
    "city": "Москва"
  },
  "destination": {
    "address": "пр. Мира, 10",
    "city": "Санкт-Петербург"
  },
  "cargo": {
    "description": "Мебель",
    "weight": 2000,
    "weightUnit": "kg",
    "volume": 15,
    "volumeUnit": "cubic_meters"
  },
  "scheduledDate": "2024-12-20T10:00:00Z",
  "distance": 700,
  "distanceUnit": "km",
  "cost": 50000,
  "currency": "RUB"
}
```

#### Получить список доставок
```
GET /api/deliveries?page=1&limit=10&sort=scheduledDate&order=asc
```

**Параметры запроса:**
- `page`, `limit`, `sort`, `order` - пагинация и сортировка
- `search` - поиск по deliveryNumber, адресам, городам, описанию груза
- `deliveryNumber` - фильтр по номеру доставки
- `driver` - фильтр по ID водителя
- `vehicle` - фильтр по ID транспорта
- `status` - фильтр по статусу
- `originCity` - фильтр по городу отправления
- `destinationCity` - фильтр по городу назначения
- `minWeight` - минимальный вес груза
- `maxWeight` - максимальный вес груза
- `minCost` - минимальная стоимость
- `maxCost` - максимальная стоимость
- `scheduledDateFrom` - дата начала периода
- `scheduledDateTo` - дата окончания периода

**Примеры:**
```
GET /api/deliveries?status=in_transit&originCity=Москва
GET /api/deliveries?driver=507f1f77bcf86cd799439011&status=scheduled
GET /api/deliveries?minWeight=1000&maxWeight=5000&sort=cost&order=desc
GET /api/deliveries?scheduledDateFrom=2024-12-01&scheduledDateTo=2024-12-31
```

#### Получить доставку по ID
```
GET /api/deliveries/:id
```

#### Проверить существование доставки
```
GET /api/deliveries/:id/exists
```

#### Обновить доставку
```
PUT /api/deliveries/:id
Content-Type: application/json

{
  "status": "delivered",
  "actualEndDate": "2024-12-20T18:00:00Z"
}
```

#### Удалить доставку
```
DELETE /api/deliveries/:id
```

## Валидация данных

Все модели используют встроенные и пользовательские валидаторы Mongoose:

- **Встроенные валидаторы**: `required`, `min`, `max`, `minlength`, `maxlength`, `enum`
- **Пользовательские валидаторы**: 
  - Формат номерного знака (российский формат)
  - Формат телефона (российский формат)
  - Формат email
  - Формат номера водительского удостоверения
  - Проверка дат (не в будущем, логические проверки)

## Обработка ошибок

API возвращает структурированные ответы об ошибках:

**Успешный ответ:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Ошибка:**
```json
{
  "success": false,
  "message": "Описание ошибки",
  "errors": ["Детали ошибок валидации"]
}
```

**Коды статусов:**
- `200` - успешный запрос
- `201` - успешное создание
- `400` - ошибка валидации или неверный запрос
- `404` - ресурс не найден
- `500` - внутренняя ошибка сервера

## Клиентская часть (React)

### Установка и запуск

1. Перейдите в папку `client`:
```bash
cd client
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите клиентское приложение:
```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3001`

### Функциональность клиентской части

- **Адаптивный интерфейс** - работает на всех устройствах
- **Redux для state management** - централизованное управление состоянием
- **Роутинг** - навигация между страницами с помощью React Router
- **CRUD операции** - создание, чтение, обновление и удаление записей
- **Формы с валидацией** - клиентская валидация с помощью react-hook-form
- **Пагинация, сортировка, фильтрация, поиск** - все функции доступны в интерфейсе
- **Детальные страницы** - просмотр подробной информации с возможностью загрузки фото
- **Подтверждение удаления** - модальные окна для подтверждения действий
- **Уведомления** - toast-уведомления об успешных операциях и ошибках
- **Загрузка фото** - возможность загружать изображения для каждой сущности

### Структура клиентской части

```
client/
├── src/
│   ├── components/        # Переиспользуемые компоненты
│   │   ├── DataTable.jsx  # Таблица данных
│   │   ├── Pagination.jsx # Пагинация
│   │   ├── ConfirmModal.jsx # Модальное окно подтверждения
│   │   └── VehicleForm.jsx, DriverForm.jsx, DeliveryForm.jsx # Формы
│   ├── pages/             # Страницы приложения
│   │   ├── VehiclesPage.jsx
│   │   ├── DriversPage.jsx
│   │   ├── DeliveriesPage.jsx
│   │   └── *DetailPage.jsx # Детальные страницы
│   ├── store/             # Redux store
│   │   ├── store.js
│   │   └── slices/        # Redux слайсы
│   ├── services/          # API сервисы
│   │   └── api.js         # Axios конфигурация
│   ├── App.jsx            # Главный компонент
│   └── main.jsx           # Точка входа
```

## Тестовые сценарии для Postman

### Подготовка к тестированию

1. **Импорт коллекции:**
   - Откройте Postman
   - Нажмите `Import` → выберите файл `postman_collection.json`
   - Или скопируйте содержимое файла и вставьте через `Import` → `Raw text`

2. **Настройка переменных:**
   - В коллекции установите переменную `base_url` = `http://localhost:3000`
   - Убедитесь, что сервер запущен на порту 3000

3. **Порядок тестирования:**
   - Сначала создайте записи (Vehicles, Drivers)
   - Затем создайте Deliveries (требуются существующие Vehicles и Drivers)
   - Протестируйте остальные операции

---

### Сценарий 1: Health Check

**Запрос:**
```
GET http://localhost:3000/api/health
```

**Ожидаемый ответ (200 OK):**
```json
{
  "status": "OK",
  "message": "Transport Logistics API is running"
}
```

---

### Сценарий 2: Создание транспорта (Vehicles)

#### 2.1. Успешное создание

**Запрос:**
```
POST http://localhost:3000/api/vehicles
Content-Type: application/json

{
  "licensePlate": "А123БВ777",
  "brand": "Камаз",
  "model": "65117",
  "year": 2020,
  "vehicleType": "truck",
  "capacity": 10000,
  "capacityUnit": "kg",
  "status": "available"
}
```

**Ожидаемый ответ (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "licensePlate": "А123БВ777",
    "brand": "Камаз",
    "model": "65117",
    "year": 2020,
    "vehicleType": "truck",
    "capacity": 10000,
    "capacityUnit": "kg",
    "status": "available",
    "mileage": 0,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Сохраните `_id` из ответа для последующих тестов!**

#### 2.2. Ошибка валидации (неверный формат номерного знака)

**Запрос:**
```
POST http://localhost:3000/api/vehicles
Content-Type: application/json

{
  "licensePlate": "123ABC",
  "brand": "Камаз",
  "model": "65117",
  "year": 2020,
  "vehicleType": "truck",
  "capacity": 10000,
  "capacityUnit": "kg"
}
```

**Ожидаемый ответ (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Invalid license plate format. Expected format: А123БВ777"
  ]
}
```

#### 2.3. Ошибка дублирования

**Запрос:** (повторите запрос из 2.1 с тем же `licensePlate`)

**Ожидаемый ответ (400 Bad Request):**
```json
{
  "success": false,
  "message": "Vehicle with this license plate already exists"
}
```

---

### Сценарий 3: Получение списка транспорта

#### 3.1. Базовый запрос с пагинацией

**Запрос:**
```
GET http://localhost:3000/api/vehicles?page=1&limit=10
```

**Ожидаемый ответ (200 OK):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### 3.2. Поиск по нескольким полям

**Запрос:**
```
GET http://localhost:3000/api/vehicles?search=камаз
```

**Ожидаемый ответ:** Список транспорта, содержащего "камаз" в номере, марке или модели

#### 3.3. Фильтрация по нескольким полям

**Запрос:**
```
GET http://localhost:3000/api/vehicles?vehicleType=truck&status=available&minCapacity=5000&maxCapacity=15000
```

**Ожидаемый ответ:** Только грузовики со статусом "available" и грузоподъемностью от 5000 до 15000

#### 3.4. Сортировка

**Запрос:**
```
GET http://localhost:3000/api/vehicles?sort=year&order=desc
```

**Ожидаемый ответ:** Транспорт отсортирован по году выпуска (от новых к старым)

---

### Сценарий 4: Получение транспорта по ID

#### 4.1. Успешное получение

**Запрос:**
```
GET http://localhost:3000/api/vehicles/{vehicle_id}
```

**Ожидаемый ответ (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "licensePlate": "А123БВ777",
    ...
  }
}
```

#### 4.2. Запись не найдена

**Запрос:**
```
GET http://localhost:3000/api/vehicles/507f1f77bcf86cd799439999
```

**Ожидаемый ответ (404 Not Found):**
```json
{
  "success": false,
  "message": "Vehicle not found"
}
```

---

### Сценарий 5: Проверка существования транспорта

**Запрос:**
```
GET http://localhost:3000/api/vehicles/{vehicle_id}/exists
```

**Ожидаемый ответ (200 OK):**
```json
{
  "success": true,
  "exists": true
}
```

Или для несуществующей записи:
```json
{
  "success": true,
  "exists": false
}
```

---

### Сценарий 6: Обновление транспорта

#### 6.1. Успешное обновление

**Запрос:**
```
PUT http://localhost:3000/api/vehicles/{vehicle_id}
Content-Type: application/json

{
  "status": "maintenance",
  "mileage": 50000,
  "lastMaintenanceDate": "2024-12-01"
}
```

**Ожидаемый ответ (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "maintenance",
    "mileage": 50000,
    ...
  }
}
```

#### 6.2. Обновление несуществующей записи

**Запрос:**
```
PUT http://localhost:3000/api/vehicles/507f1f77bcf86cd799439999
Content-Type: application/json

{
  "status": "available"
}
```

**Ожидаемый ответ (404 Not Found):**
```json
{
  "success": false,
  "message": "Vehicle not found"
}
```

---

### Сценарий 7: Удаление транспорта

#### 7.1. Успешное удаление

**Запрос:**
```
DELETE http://localhost:3000/api/vehicles/{vehicle_id}
```

**Ожидаемый ответ (200 OK):**
```json
{
  "success": true,
  "message": "Vehicle deleted successfully",
  "data": { ... }
}
```

#### 7.2. Удаление несуществующей записи

**Запрос:**
```
DELETE http://localhost:3000/api/vehicles/507f1f77bcf86cd799439999
```

**Ожидаемый ответ (404 Not Found):**
```json
{
  "success": false,
  "message": "Vehicle not found"
}
```

---

### Сценарий 8: Загрузка фото транспорта

**Запрос:**
```
POST http://localhost:3000/api/vehicles/{vehicle_id}/photo
Content-Type: multipart/form-data

Body (form-data):
  photo: [выберите файл изображения]
```

**Ожидаемый ответ (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "photoUrl": "/uploads/photo-1234567890.jpg",
    ...
  }
}
```

**Проверка:** После загрузки выполните GET запрос по ID и проверьте поле `photoUrl`

---

### Сценарий 9: Создание водителя (Drivers)

#### 9.1. Успешное создание

**Запрос:**
```
POST http://localhost:3000/api/drivers
Content-Type: application/json

{
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79123456789",
  "email": "ivan@example.com",
  "licenseNumber": "77АВ123456",
  "licenseCategory": ["C", "CE"],
  "experience": 5,
  "status": "available",
  "hireDate": "2020-01-15",
  "address": {
    "city": "Москва",
    "street": "Ленина, 1"
  }
}
```

**Ожидаемый ответ (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "firstName": "Иван",
    "lastName": "Иванов",
    ...
  }
}
```

**Сохраните `_id` для создания доставок!**

#### 9.2. Ошибка валидации (неверный формат телефона)

**Запрос:**
```
POST http://localhost:3000/api/drivers
Content-Type: application/json

{
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "123456",
  "email": "ivan@example.com",
  ...
}
```

**Ожидаемый ответ (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Invalid phone number format. Expected: +7XXXXXXXXXX or 8XXXXXXXXXX"
  ]
}
```

---

### Сценарий 10: Поиск и фильтрация водителей

#### 10.1. Поиск по нескольким полям

**Запрос:**
```
GET http://localhost:3000/api/drivers?search=иванов
```

**Ожидаемый ответ:** Водители, у которых "иванов" встречается в имени, фамилии, email, телефоне или номере прав

#### 10.2. Фильтрация по нескольким параметрам

**Запрос:**
```
GET http://localhost:3000/api/drivers?status=available&licenseCategory=C&minExperience=3&city=Москва
```

**Ожидаемый ответ:** Доступные водители с категорией C, опытом от 3 лет из Москвы

---

### Сценарий 11: Создание доставки (Deliveries)

#### 11.1. Успешное создание

**Запрос:**
```
POST http://localhost:3000/api/deliveries
Content-Type: application/json

{
  "driver": "{driver_id}",
  "vehicle": "{vehicle_id}",
  "origin": {
    "address": "ул. Ленина, 1",
    "city": "Москва"
  },
  "destination": {
    "address": "пр. Мира, 10",
    "city": "Санкт-Петербург"
  },
  "cargo": {
    "description": "Мебель",
    "weight": 2000,
    "weightUnit": "kg",
    "volume": 15,
    "volumeUnit": "cubic_meters"
  },
  "scheduledDate": "2024-12-20T10:00:00Z",
  "distance": 700,
  "distanceUnit": "km",
  "cost": 50000,
  "currency": "RUB"
}
```

**Ожидаемый ответ (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "deliveryNumber": "DLV-000001",
    "driver": { ... },
    "vehicle": { ... },
    ...
  }
}
```

**Примечание:** `deliveryNumber` генерируется автоматически, если не указан

#### 11.2. Ошибка валидации (несуществующий водитель)

**Запрос:**
```
POST http://localhost:3000/api/deliveries
Content-Type: application/json

{
  "driver": "507f1f77bcf86cd799439999",
  "vehicle": "{vehicle_id}",
  ...
}
```

**Ожидаемый ответ (400 Bad Request):** Ошибка валидации или 500, если валидация ссылок не настроена

---

### Сценарий 12: Комплексный поиск доставок

#### 12.1. Поиск по нескольким полям

**Запрос:**
```
GET http://localhost:3000/api/deliveries?search=москва
```

**Ожидаемый ответ:** Доставки, где "москва" встречается в номере, адресах, городах или описании груза

#### 12.2. Фильтрация по датам и весу

**Запрос:**
```
GET http://localhost:3000/api/deliveries?scheduledDateFrom=2024-12-01&scheduledDateTo=2024-12-31&minWeight=1000&maxWeight=5000
```

**Ожидаемый ответ:** Доставки в декабре 2024 с весом груза от 1000 до 5000 кг

---

### Сценарий 13: Полный цикл CRUD операций

**Последовательность действий:**

1. **Создайте транспорт:**
   ```
   POST /api/vehicles
   ```
   Сохраните `vehicle_id`

2. **Создайте водителя:**
   ```
   POST /api/drivers
   ```
   Сохраните `driver_id`

3. **Получите список транспорта:**
   ```
   GET /api/vehicles?page=1&limit=10
   ```
   Проверьте пагинацию

4. **Получите транспорт по ID:**
   ```
   GET /api/vehicles/{vehicle_id}
   ```

5. **Обновите транспорт:**
   ```
   PUT /api/vehicles/{vehicle_id}
   ```

6. **Создайте доставку:**
   ```
   POST /api/deliveries
   ```
   Используйте сохраненные `vehicle_id` и `driver_id`

7. **Получите доставку с populate:**
   ```
   GET /api/deliveries/{delivery_id}
   ```
   Проверьте, что `driver` и `vehicle` заполнены данными

8. **Обновите статус доставки:**
   ```
   PUT /api/deliveries/{delivery_id}
   {
     "status": "delivered",
     "actualEndDate": "2024-12-20T18:00:00Z"
   }
   ```

9. **Удалите доставку:**
   ```
   DELETE /api/deliveries/{delivery_id}
   ```

10. **Удалите транспорт и водителя:**
    ```
    DELETE /api/vehicles/{vehicle_id}
    DELETE /api/drivers/{driver_id}
    ```

---

### Сценарий 14: Тестирование обработки ошибок

#### 14.1. Неверный формат ID

**Запрос:**
```
GET http://localhost:3000/api/vehicles/invalid-id
```

**Ожидаемый ответ (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid vehicle ID"
}
```

#### 14.2. Неверный метод для эндпоинта

**Запрос:**
```
POST http://localhost:3000/api/vehicles/{vehicle_id}
```

**Ожидаемый ответ (404 Not Found):**
```json
{
  "success": false,
  "message": "Route not found"
}
```

#### 14.3. Отсутствие обязательных полей

**Запрос:**
```
POST http://localhost:3000/api/vehicles
Content-Type: application/json

{
  "brand": "Камаз"
}
```

**Ожидаемый ответ (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "License plate is required",
    "Model is required",
    ...
  ]
}
```

---

### Чек-лист тестирования

- [ ] Health Check работает
- [ ] Создание всех сущностей (Vehicles, Drivers, Deliveries)
- [ ] Валидация при создании работает корректно
- [ ] Получение списков с пагинацией
- [ ] Поиск по нескольким полям работает
- [ ] Фильтрация по нескольким полям работает
- [ ] Сортировка работает
- [ ] Получение по ID работает
- [ ] Проверка существования работает
- [ ] Обновление записей работает
- [ ] Удаление записей работает
- [ ] Загрузка фото работает
- [ ] Обработка ошибок (404, 400, 500) работает корректно
- [ ] Обработка несуществующих записей работает
- [ ] Валидация форматов (номерной знак, телефон, email) работает

## Health Check

```
GET /api/health
```

Возвращает статус работы API.

## Краткая инструкция по быстрому запуску

### Быстрый старт (для опытных пользователей)

**Терминал 1 - Сервер:**
```bash
npm install
# Создайте .env файл с PORT=3000 и MONGODB_URI=mongodb://localhost:27017/transport_logistics
npm run dev
```

**Терминал 2 - Клиент:**
```bash
cd client
npm install
npm run dev
```

**Браузер:**
```
http://localhost:3001
```

### Проверка работоспособности

1. **Сервер:** `http://localhost:3000/api/health` → должен вернуть `{"status":"OK"}`
2. **Клиент:** `http://localhost:3001` → должна открыться главная страница
3. **MongoDB:** Убедитесь, что база данных запущена и доступна

### Порты приложения

- **3000** - Express API сервер
- **3001** - React клиентское приложение (Vite)
- **27017** - MongoDB (по умолчанию)

### Полезные команды

**Очистка базы данных (MongoDB shell):**
```javascript
use transport_logistics
db.vehicles.deleteMany({})
db.drivers.deleteMany({})
db.deliveries.deleteMany({})
```

**Просмотр логов сервера:**
Все логи выводятся в консоль, где запущен сервер

**Остановка всех процессов:**
Нажмите `Ctrl+C` в каждом терминале
