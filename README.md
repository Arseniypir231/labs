# WebLab - React SPA с Express Backend

Проект представляет собой полнофункциональное веб-приложение для управления блогом с React фронтендом и Express бэкендом.

## Структура проекта

```
server/
├── app.js                    # Express сервер (главный файл)
├── routes/
│   ├── posts.js              # Роуты для работы с постами
│   └── data.js               # Роут с поддержкой Accept заголовка
├── utils/
│   └── fileUtils.js          # Утилиты для работы с JSON файлами
└── data/
    └── posts.json            # JSON файл с данными постов

public/
├── api-demo.html             # HTML страница для демонстрации API
└── api-demo.js               # JavaScript для работы с API

src/                          # React приложение
```

## Реализация сервисов

### 1. GET-сервис для веб-страницы

**Описание:** Возвращает HTML страницу с фронтенд-кодом (React приложение или демо-страницу API).

**Реализация:**
- **Файл:** `server/app.js`
- **Маршрут:** `GET /` и `GET /api-demo.html`
- **Метод:** `res.sendFile()` для отправки статического HTML файла

**Пример запроса:**
```http
GET / HTTP/1.1
Host: localhost:3001
```

**Пример ответа:**
```html
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>...</html>
```

**Код реализации:**
```javascript
// GET / - Возвращает веб-страницу с фронтенд-кодом (React)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

// GET /api-demo.html - Возвращает HTML страницу для демонстрации API
app.get('/api-demo.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/api-demo.html'));
});
```

**Особенности:**
- Использует `path.join()` для безопасного построения пути к файлу
- Отдает статические файлы из папки `build` (React) или `public` (демо-страница)
- Поддерживает CORS для кросс-доменных запросов

---

### 2. GET-сервис для получения данных в формате JSON

**Описание:** Возвращает данные постов в формате JSON. Поддерживает получение всех постов или конкретного поста по ID.

**Реализация:**
- **Файл:** `server/routes/posts.js`
- **Маршруты:** 
  - `GET /api/posts` - получить все посты
  - `GET /api/posts/:id` - получить пост по ID

**Пример запроса (все посты):**
```http
GET /api/posts HTTP/1.1
Host: localhost:3001
```

**Пример ответа:**
```json
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "image": "/assets/Post1.1.jpg",
    "alt": "post_1_1",
    "category": "TOURISM",
    "title": "One of Saturn's largest rings may be newer than anyone",
    "date": "June 6, 2019",
    "author": "Rickie Baroch"
  },
  ...
]
```

**Пример запроса (пост по ID):**
```http
GET /api/posts/1 HTTP/1.1
Host: localhost:3001
```

**Пример ответа:**
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "image": "/assets/Post1.1.jpg",
  "category": "TOURISM",
  "title": "One of Saturn's largest rings may be newer than anyone",
  "date": "June 6, 2019",
  "author": "Rickie Baroch"
}
```

**Код реализации:**
```javascript
// GET /api/posts - Получить все посты
router.get('/', async (req, res) => {
    try {
        const posts = await readJsonFile('posts.json');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/posts/:id - Получить пост по ID
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
```

**Обработка ошибок:**
- 404 - если пост с указанным ID не найден
- 500 - при ошибке чтения файла или парсинга JSON

---

### 3. POST-сервис для создания поста

**Описание:** Принимает данные нового поста в теле запроса и сохраняет их в JSON файл. Возвращает созданный пост с присвоенным ID.

**Реализация:**
- **Файл:** `server/routes/posts.js`
- **Маршрут:** `POST /api/posts`

**Пример запроса:**
```http
POST /api/posts HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "image": "/assets/new_post.jpg",
  "category": "FASHION",
  "title": "New Fashion Trends 2024",
  "date": "January 15, 2024",
  "author": "John Doe",
  "comments": 5,
  "description": "Latest fashion trends for 2024"
}
```

**Пример ответа (успех):**
```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 12,
  "image": "/assets/new_post.jpg",
  "alt": "post_12",
  "category": "FASHION",
  "title": "New Fashion Trends 2024",
  "date": "January 15, 2024",
  "author": "John Doe",
  "comments": 5,
  "description": "Latest fashion trends for 2024"
}
```

**Пример ответа (ошибка валидации):**
```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Missing required fields: image, category, title, date, author"
}
```

**Код реализации:**
```javascript
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
```

**Особенности:**
- Валидация обязательных полей перед созданием
- Автоматическая генерация уникального ID
- Сохранение данных в JSON файл синхронно
- Возвращает статус 201 (Created) при успешном создании

---

### 4. POST-сервис для поиска (возвращает данные)

**Описание:** Принимает параметры поиска в теле запроса и возвращает отфильтрованные посты в формате JSON.

**Реализация:**
- **Файл:** `server/routes/posts.js`
- **Маршрут:** `POST /api/posts/search`

**Пример запроса:**
```http
POST /api/posts/search HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "query": "Saturn",
  "category": "TOURISM",
  "author": "Rickie Baroch"
}
```

**Пример ответа:**
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "count": 2,
  "results": [
    {
      "id": 1,
      "category": "TOURISM",
      "title": "One of Saturn's largest rings may be newer than anyone",
      "date": "June 6, 2019",
      "author": "Rickie Baroch"
    },
    ...
  ]
}
```

**Код реализации:**
```javascript
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
```

**Особенности:**
- Поддерживает множественную фильтрацию (поиск, категория, автор)
- Поиск не чувствителен к регистру
- Возвращает количество найденных постов и массив результатов
- Все параметры поиска опциональны

---

### 5. DELETE-сервис для удаления поста

**Описание:** Удаляет пост по указанному ID из JSON файла и возвращает информацию об удаленном посте.

**Реализация:**
- **Файл:** `server/routes/posts.js`
- **Маршрут:** `DELETE /api/posts/:id`

**Пример запроса:**
```http
DELETE /api/posts/5 HTTP/1.1
Host: localhost:3001
```

**Пример ответа (успех):**
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Post deleted successfully",
  "deletedPost": {
    "id": 5,
    "category": "CLOTHES",
    "title": "One of Saturn's largest rings may be newer than anyone",
    ...
  }
}
```

**Пример ответа (пост не найден):**
```json
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": "Post not found"
}
```

**Код реализации:**
```javascript
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
```

**Особенности:**
- Проверяет существование поста перед удалением
- Возвращает удаленный пост в ответе
- Обновляет JSON файл после удаления
- Обрабатывает ошибки чтения/записи файла

---

### 6. Сервис с поддержкой Accept заголовка (JSON/XML/HTML)

**Описание:** Возвращает данные постов в формате JSON, XML или HTML в зависимости от заголовка `Accept` в запросе.

**Реализация:**
- **Файл:** `server/routes/data.js`
- **Маршрут:** `GET /api/data`

**Пример запроса (JSON):**
```http
GET /api/data HTTP/1.1
Host: localhost:3001
Accept: application/json
```

**Пример ответа (JSON):**
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "count": 11,
  "posts": [...]
}
```

**Пример запроса (XML):**
```http
GET /api/data HTTP/1.1
Host: localhost:3001
Accept: application/xml
```

**Пример ответа (XML):**
```xml
HTTP/1.1 200 OK
Content-Type: application/xml

<?xml version="1.0" encoding="UTF-8"?>
<posts>
  <post>
    <id>1</id>
    <category>TOURISM</category>
    <title>One of Saturn's largest rings...</title>
    ...
  </post>
  ...
</posts>
```

**Пример запроса (HTML):**
```http
GET /api/data HTTP/1.1
Host: localhost:3001
Accept: text/html
```

**Пример ответа (HTML):**
```html
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
<head>
    <title>Posts Data</title>
    <style>...</style>
</head>
<body>
    <h1>Posts Data</h1>
    <p>Total posts: 11</p>
    <div class="post">...</div>
    ...
</body>
</html>
```

**Код реализации:**
```javascript
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
            const html = `<!DOCTYPE html>...`;
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
```

**Особенности:**
- Определяет формат ответа по заголовку `Accept`
- Использует библиотеку `xml2js` для преобразования в XML
- Генерирует HTML с встроенными стилями
- По умолчанию возвращает JSON, если заголовок не указан
- Устанавливает правильный `Content-Type` для каждого формата

---

## Обработка исключительных ситуаций

Все сервисы обрабатывают следующие исключительные ситуации:

1. **Ошибки чтения/записи файлов (500)**
   - Файл не существует
   - Некорректный формат JSON
   - Ошибки доступа к файлу

2. **Ошибки валидации (400)**
   - Отсутствие обязательных полей при создании поста
   - Некорректный формат данных

3. **Ресурс не найден (404)**
   - Пост с указанным ID не существует
   - Неверный маршрут

4. **Глобальный обработчик ошибок**
   - Логирование ошибок в консоль
   - Возврат понятных сообщений об ошибках
   - В режиме разработки возвращает stack trace

**Пример обработки ошибок:**
```javascript
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
```

---

## Работа с JSON файлами

**Особенности реализации:**
- Данные хранятся в `server/data/posts.json`
- Файлы читаются при каждом запросе (актуальность данных)
- При изменении JSON файлов приложение продолжает работу
- Используются асинхронные операции (`fs.promises`) для работы с файлами
- Обработка ошибок при чтении/записи файлов

**Утилиты для работы с файлами (`server/utils/fileUtils.js`):**
```javascript
async function readJsonFile(filename) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Error reading file ${filename}: ${error.message}`);
    }
}

async function writeJsonFile(filename, data) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        throw new Error(`Error writing file ${filename}: ${error.message}`);
    }
}
```

---

## Запуск приложения

### Установка зависимостей
```bash
npm install
```

### Запуск сервера
```bash
npm run server
```

Сервер запускается на порту 3001 (или PORT из переменных окружения).

### Запуск сервера и React приложения одновременно
```bash
npm run dev
```

### Доступ к приложению
- React приложение: `http://localhost:3001/`
- API демо-страница: `http://localhost:3001/api-demo.html`
- API endpoints: `http://localhost:3001/api/`

---

## Используемые технологии

- **Backend:** Express.js, Node.js
- **Frontend:** React, React Router, Redux Toolkit
- **Стилизация:** Bootstrap, React Bootstrap
- **Интернационализация:** i18next, react-i18next
- **Уведомления:** react-toastify
- **Иконки:** react-icons

---

## История коммитов

Все изменения закоммичены с использованием conventional commits:
- `feat:` - новые функции
- `fix:` - исправления ошибок
- `docs:` - документация
- `refactor:` - рефакторинг кода
