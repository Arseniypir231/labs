# Express Backend Server

## Описание

Express сервер для работы с данными блога. Реализует REST API для управления постами.

## API Endpoints

### GET сервисы

1. **GET /** - Возвращает веб-страницу с фронтенд-кодом
   - Возвращает `index.html` из build папки

2. **GET /api/posts** - Возвращает все посты в формате JSON
   - Ответ: массив постов

3. **GET /api/posts/:id** - Возвращает пост по ID
   - Параметры: `id` (число)
   - Ответ: объект поста или 404 если не найден

4. **GET /api/data** - Возвращает данные в формате JSON/XML/HTML в зависимости от заголовка Accept
   - Заголовки:
     - `Accept: application/json` - JSON формат (по умолчанию)
     - `Accept: application/xml` или `text/xml` - XML формат
     - `Accept: text/html` - HTML формат
   - Ответ: данные в выбранном формате

### POST сервисы

1. **POST /api/posts** - Создает новый пост
   - Тело запроса (JSON):
     ```json
     {
       "image": "string (required)",
       "category": "string (required)",
       "title": "string (required)",
       "date": "string (required)",
       "author": "string (required)",
       "alt": "string (optional)",
       "comments": "number (optional)",
       "description": "string (optional)"
     }
     ```
   - Ответ: созданный пост с ID

2. **POST /api/posts/search** - Поиск постов (возвращает данные)
   - Тело запроса (JSON):
     ```json
     {
       "query": "string (optional)",
       "category": "string (optional)",
       "author": "string (optional)"
     }
     ```
   - Ответ: объект с количеством результатов и массивом найденных постов

### DELETE сервисы

1. **DELETE /api/posts/:id** - Удаляет пост
   - Параметры: `id` (число)
   - Ответ: сообщение об успешном удалении и удаленный пост

## Обработка ошибок

Сервер обрабатывает следующие исключительные ситуации:
- Отсутствие обязательных полей (400)
- Пост не найден (404)
- Ошибки чтения/записи файлов (500)
- Некорректный формат данных (500)

## Хранение данных

Данные хранятся в JSON файлах в папке `server/data/`:
- `posts.json` - массив постов

При изменении JSON файлов приложение продолжает работу, так как файлы читаются при каждом запросе.

## Запуск

```bash
# Запуск только сервера
npm run server

# Запуск сервера и React приложения одновременно
npm run dev
```

Сервер запускается на порту 3001 (или PORT из переменных окружения).
