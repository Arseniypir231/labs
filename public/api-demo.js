// Конфигурация API
const API_BASE_URL = 'http://localhost:3001/api';

// Утилиты для работы с сообщениями
function showMessage(text, type = 'success') {
    const messagesContainer = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Функция для отображения постов
function displayPosts(posts, containerId) {
    const container = document.getElementById(containerId);
    
    if (!posts || posts.length === 0) {
        container.innerHTML = '<div class="loading">Посты не найдены</div>';
        return;
    }
    
    container.innerHTML = posts.map(post => `
        <div class="post-card">
            <span class="category">${post.category}</span>
            <h3>${post.title}</h3>
            <div class="meta">
                <div>📅 ${post.date}</div>
                <div>✍️ ${post.author}</div>
                ${post.comments ? `<div>💬 ${post.comments} комментариев</div>` : ''}
            </div>
            ${post.description ? `<p style="margin-top: 10px; font-size: 12px; color: #666;">${post.description.substring(0, 100)}...</p>` : ''}
            <div class="actions">
                <button onclick="deletePostById(${post.id})" class="danger">Удалить</button>
            </div>
        </div>
    `).join('');
}

// 1. GET - Загрузить все посты
async function loadAllPosts() {
    try {
        const container = document.getElementById('postsContainer');
        container.innerHTML = '<div class="loading">Загрузка...</div>';
        
        const response = await fetch(`${API_BASE_URL}/posts`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const posts = await response.json();
        displayPosts(posts, 'postsContainer');
        showMessage(`Загружено ${posts.length} постов`, 'success');
    } catch (error) {
        showMessage(`Ошибка при загрузке постов: ${error.message}`, 'error');
        document.getElementById('postsContainer').innerHTML = '<div class="loading">Ошибка загрузки</div>';
    }
}

// 2. GET - Загрузить пост по ID
async function loadPostById() {
    try {
        const postId = document.getElementById('postIdInput').value;
        
        if (!postId) {
            showMessage('Введите ID поста', 'error');
            return;
        }
        
        const container = document.getElementById('postsContainer');
        container.innerHTML = '<div class="loading">Загрузка...</div>';
        
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Пост не найден');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const post = await response.json();
        displayPosts([post], 'postsContainer');
        showMessage('Пост загружен успешно', 'success');
    } catch (error) {
        showMessage(`Ошибка: ${error.message}`, 'error');
        document.getElementById('postsContainer').innerHTML = '<div class="loading">Ошибка загрузки</div>';
    }
}

// 3. POST - Поиск постов
async function searchPosts() {
    try {
        const query = document.getElementById('searchQuery').value;
        const category = document.getElementById('searchCategory').value;
        const author = document.getElementById('searchAuthor').value;
        
        const searchData = {};
        if (query) searchData.query = query;
        if (category) searchData.category = category;
        if (author) searchData.author = author;
        
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '<div class="loading">Поиск...</div>';
        
        const response = await fetch(`${API_BASE_URL}/posts/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.results && result.results.length > 0) {
            resultsContainer.innerHTML = `
                <h3>Найдено постов: ${result.count}</h3>
                <div class="posts-list" id="searchPostsList"></div>
            `;
            displayPosts(result.results, 'searchPostsList');
            showMessage(`Найдено ${result.count} постов`, 'success');
        } else {
            resultsContainer.innerHTML = '<div class="loading">Посты не найдены</div>';
            showMessage('Посты не найдены', 'error');
        }
    } catch (error) {
        showMessage(`Ошибка поиска: ${error.message}`, 'error');
        document.getElementById('searchResults').innerHTML = '<div class="loading">Ошибка поиска</div>';
    }
}

// 4. POST - Создать новый пост
async function createPost() {
    try {
        const image = document.getElementById('newPostImage').value;
        const category = document.getElementById('newPostCategory').value;
        const title = document.getElementById('newPostTitle').value;
        const date = document.getElementById('newPostDate').value;
        const author = document.getElementById('newPostAuthor').value;
        const comments = document.getElementById('newPostComments').value;
        const description = document.getElementById('newPostDescription').value;
        
        if (!image || !category || !title || !date || !author) {
            showMessage('Заполните все обязательные поля', 'error');
            return;
        }
        
        const postData = {
            image,
            category,
            title,
            date,
            author
        };
        
        if (comments) {
            postData.comments = parseInt(comments);
        }
        
        if (description) {
            postData.description = description;
        }
        
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const newPost = await response.json();
        showMessage(`Пост создан успешно! ID: ${newPost.id}`, 'success');
        
        // Очистка формы
        document.getElementById('newPostImage').value = '';
        document.getElementById('newPostCategory').value = '';
        document.getElementById('newPostTitle').value = '';
        document.getElementById('newPostDate').value = '';
        document.getElementById('newPostAuthor').value = '';
        document.getElementById('newPostComments').value = '';
        document.getElementById('newPostDescription').value = '';
        
        // Обновление списка постов
        loadAllPosts();
    } catch (error) {
        showMessage(`Ошибка создания поста: ${error.message}`, 'error');
    }
}

// 5. DELETE - Удалить пост
async function deletePost() {
    try {
        const postId = document.getElementById('deletePostId').value;
        
        if (!postId) {
            showMessage('Введите ID поста для удаления', 'error');
            return;
        }
        
        if (!confirm(`Вы уверены, что хотите удалить пост с ID ${postId}?`)) {
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Пост не найден');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        showMessage(`Пост удален успешно!`, 'success');
        document.getElementById('deletePostId').value = '';
        
        // Обновление списка постов
        loadAllPosts();
    } catch (error) {
        showMessage(`Ошибка удаления: ${error.message}`, 'error');
    }
}

// Удаление поста по ID (из карточки)
async function deletePostById(postId) {
    if (!confirm(`Вы уверены, что хотите удалить пост с ID ${postId}?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Пост не найден');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        showMessage(`Пост удален успешно!`, 'success');
        loadAllPosts();
    } catch (error) {
        showMessage(`Ошибка удаления: ${error.message}`, 'error');
    }
}

// 6. Скачать данные в разных форматах
async function downloadData(format) {
    try {
        let acceptHeader;
        let filename;
        let mimeType;
        
        switch(format) {
            case 'json':
                acceptHeader = 'application/json';
                filename = 'posts.json';
                mimeType = 'application/json';
                break;
            case 'xml':
                acceptHeader = 'application/xml';
                filename = 'posts.xml';
                mimeType = 'application/xml';
                break;
            case 'html':
                acceptHeader = 'text/html';
                filename = 'posts.html';
                mimeType = 'text/html';
                break;
            default:
                acceptHeader = 'application/json';
                filename = 'posts.json';
                mimeType = 'application/json';
        }
        
        const response = await fetch(`${API_BASE_URL}/data`, {
            headers: {
                'Accept': acceptHeader
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.text();
        
        // Создание blob и скачивание
        const blob = new Blob([data], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showMessage(`Файл ${filename} скачан успешно`, 'success');
    } catch (error) {
        showMessage(`Ошибка скачивания: ${error.message}`, 'error');
    }
}

// Загрузка постов при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    loadAllPosts();
});
