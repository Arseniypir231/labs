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

async function renameFile(oldFilename, newFilename) {
  try {
    const oldPath = path.isAbsolute(oldFilename) 
      ? oldFilename 
      : path.join(DATA_DIR, oldFilename);
    const newPath = path.isAbsolute(newFilename)
      ? newFilename
      : path.join(DATA_DIR, newFilename);

    // Проверяем существование старого файла
    try {
      await fs.access(oldPath);
    } catch (error) {
      throw new Error(`Файл не найден: ${oldFilename}`);
    }

    // Проверяем, не существует ли новый файл
    try {
      await fs.access(newPath);
      throw new Error(`Файл с таким именем уже существует: ${newFilename}`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    // Переименовываем файл
    await fs.rename(oldPath, newPath);

    // Обновляем индекс, если файл связан с книгой
    const index = await loadIndex();
    const indexEntry = index.find(entry => entry.filename === oldFilename);
    if (indexEntry) {
      indexEntry.filename = path.basename(newFilename);
      await saveIndex(index);
      console.log(`Индекс обновлен для файла: ${oldFilename} -> ${newFilename}`);
    }

    console.log(`Файл успешно переименован: ${oldFilename} -> ${newFilename}`);
  } catch (error) {
    console.error('Ошибка при переименовании файла:', error.message);
    process.exit(1);
  }
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Использование: node rename.js <старое_имя> <новое_имя>');
  process.exit(1);
}

const [oldFilename, newFilename] = args;

renameFile(oldFilename, newFilename);
