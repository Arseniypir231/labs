import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const INDEX_FILE = path.join(DATA_DIR, 'book_index.json');

async function listBooks() {
  try {
    // Загружаем индекс
    const data = await fs.readFile(INDEX_FILE, 'utf-8');
    const index = JSON.parse(data);

    if (index.length === 0) {
      console.log('Каталог пуст. Нет записей о книгах.');
      return;
    }

    console.log('\n=== Каталог книг ===\n');
    index.forEach((entry, index) => {
      console.log(`${index + 1}. ID: ${entry.id}`);
      console.log(`   Название: ${entry.title}`);
      console.log(`   Автор: ${entry.author}`);
      console.log(`   Файл: ${entry.filename}`);
      console.log('');
    });
    console.log(`Всего записей: ${index.length}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Каталог пуст. Нет записей о книгах.');
    } else {
      console.error('Ошибка при чтении каталога:', error.message);
      process.exit(1);
    }
  }
}

listBooks();
