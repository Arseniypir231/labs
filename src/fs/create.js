import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const INDEX_FILE = path.join(DATA_DIR, 'book_index.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function loadIndex() {
  try {
    const data = await fs.readFile(INDEX_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function saveIndex(index) {
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
}

async function createBook(title, author, isbn, year) {
  await ensureDataDir();

  // Генерируем уникальный ID на основе timestamp
  const id = Date.now().toString();
  const filename = `book_${id}.json`;

  // Проверяем, существует ли файл с таким именем
  const filePath = path.join(DATA_DIR, filename);
  try {
    await fs.access(filePath);
    throw new Error('Ошибка операции FS: Запись уже существует');
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  // Создаем объект книги
  const book = {
    id,
    title,
    author,
    isbn,
    year: parseInt(year),
    createdAt: new Date().toISOString()
  };

  // Сохраняем файл книги
  await fs.writeFile(filePath, JSON.stringify(book, null, 2), 'utf-8');

  // Добавляем запись в индекс
  const index = await loadIndex();
  const indexEntry = {
    id,
    title,
    author,
    filename
  };
  index.push(indexEntry);
  await saveIndex(index);

  console.log(`Книга успешно создана: ${filename}`);
  console.log(`ID: ${id}`);
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 4) {
  console.error('Использование: node create.js "Название книги" "Автор книги" "ISBN" "Год издания"');
  process.exit(1);
}

const [title, author, isbn, year] = args;

createBook(title, author, isbn, year)
  .catch(error => {
    console.error('Ошибка:', error.message);
    process.exit(1);
  });
