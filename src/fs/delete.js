import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const INDEX_FILE = path.join(DATA_DIR, 'book_index.json');

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

async function deleteBook(id) {
  try {
    // Загружаем индекс
    const index = await loadIndex();
    
    // Ищем запись в индексе
    const indexEntry = index.find(entry => entry.id === id);
    
    if (!indexEntry) {
      throw new Error(`Запись с ID ${id} не найдена`);
    }

    // Удаляем файл книги
    const filePath = path.join(DATA_DIR, indexEntry.filename);
    try {
      await fs.unlink(filePath);
      console.log(`Файл удален: ${indexEntry.filename}`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      console.log(`Файл уже не существует: ${indexEntry.filename}`);
    }

    // Удаляем запись из индекса
    const updatedIndex = index.filter(entry => entry.id !== id);
    await saveIndex(updatedIndex);

    console.log(`Книга с ID ${id} успешно удалена`);
  } catch (error) {
    console.error('Ошибка при удалении записи:', error.message);
    process.exit(1);
  }
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Использование: node delete.js <ID_записи>');
  process.exit(1);
}

const [id] = args;

deleteBook(id);
