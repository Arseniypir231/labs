import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const INDEX_FILE = path.join(DATA_DIR, 'book_index.json');

async function readBook(id) {
  try {
    // Загружаем индекс
    const data = await fs.readFile(INDEX_FILE, 'utf-8');
    const index = JSON.parse(data);

    // Ищем запись в индексе
    const indexEntry = index.find(entry => entry.id === id);

    if (!indexEntry) {
      throw new Error(`Запись с ID ${id} не найдена`);
    }

    // Читаем файл книги
    const filePath = path.join(DATA_DIR, indexEntry.filename);
    const bookData = await fs.readFile(filePath, 'utf-8');
    const book = JSON.parse(bookData);

    // Выводим подробную информацию
    console.log('\n=== Информация о книге ===\n');
    console.log(`ID: ${book.id}`);
    console.log(`Название: ${book.title}`);
    console.log(`Автор: ${book.author}`);
    console.log(`ISBN: ${book.isbn}`);
    console.log(`Год издания: ${book.year}`);
    console.log(`Дата создания записи: ${book.createdAt}`);
    console.log(`Файл: ${indexEntry.filename}`);
    console.log('');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Запись с ID ${id} не найдена`);
    } else {
      console.error('Ошибка при чтении записи:', error.message);
    }
    process.exit(1);
  }
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Использование: node read.js <ID_записи>');
  process.exit(1);
}

const [id] = args;

readBook(id);
