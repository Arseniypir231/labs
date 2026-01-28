import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const INDEX_FILE = path.join(DATA_DIR, 'book_index.json');

// Создаем скрипт для тяжелой операции поиска
const searchScript = `
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const INDEX_FILE = path.join(DATA_DIR, 'book_index.json');

async function fullTextSearch(keyword) {
  try {
    // Загружаем индекс
    const indexData = await fs.readFile(INDEX_FILE, 'utf-8');
    const index = JSON.parse(indexData);
    
    const results = [];
    
    // Ищем по всем файлам книг
    for (const entry of index) {
      const filePath = path.join(DATA_DIR, entry.filename);
      try {
        const bookData = await fs.readFile(filePath, 'utf-8');
        const book = JSON.parse(bookData);
        
        // Полнотекстовый поиск по всем полям
        const searchText = JSON.stringify(book).toLowerCase();
        const keywordLower = keyword.toLowerCase();
        
        if (searchText.includes(keywordLower)) {
          results.push({
            id: book.id,
            title: book.title,
            author: book.author,
            matches: []
          });
          
          // Находим совпадения в разных полях
          if (book.title && book.title.toLowerCase().includes(keywordLower)) {
            results[results.length - 1].matches.push('title');
          }
          if (book.author && book.author.toLowerCase().includes(keywordLower)) {
            results[results.length - 1].matches.push('author');
          }
          if (book.isbn && book.isbn.toLowerCase().includes(keywordLower)) {
            results[results.length - 1].matches.push('isbn');
          }
        }
      } catch (error) {
        // Пропускаем файлы, которые не удалось прочитать
        continue;
      }
    }
    
    // Выводим результаты
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }));
    process.exit(1);
  }
}

const keyword = process.argv[2];
if (!keyword) {
  console.error(JSON.stringify({ error: 'Ключевое слово не указано' }));
  process.exit(1);
}

fullTextSearch(keyword);
`;

async function runSearch(keyword) {
  // Создаем временный скрипт для поиска
  const tempScriptPath = path.join(__dirname, 'temp_search.js');
  await fs.writeFile(tempScriptPath, searchScript, 'utf-8');

  return new Promise((resolve, reject) => {
    // Запускаем отдельный процесс Node.js для выполнения поиска
    const child = spawn('node', [tempScriptPath, keyword], {
      cwd: process.cwd(),
      stdio: ['inherit', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', async (code) => {
      // Удаляем временный скрипт
      try {
        await fs.unlink(tempScriptPath);
      } catch (error) {
        // Игнорируем ошибки удаления
      }

      if (code !== 0) {
        reject(new Error(stderr || `Процесс завершился с кодом ${code}`));
        return;
      }

      try {
        const results = JSON.parse(stdout);
        if (results.error) {
          reject(new Error(results.error));
          return;
        }
        resolve(results);
      } catch (error) {
        reject(new Error(`Ошибка парсинга результатов: ${error.message}`));
      }
    });

    child.on('error', async (error) => {
      // Удаляем временный скрипт при ошибке
      try {
        await fs.unlink(tempScriptPath);
      } catch {
        // Игнорируем ошибки удаления
      }
      reject(error);
    });
  });
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Использование: node spawn.js <ключевое_слово>');
  process.exit(1);
}

const [keyword] = args;

console.log(`Выполняется полнотекстовый поиск по ключевому слову: "${keyword}"\n`);

runSearch(keyword)
  .then(results => {
    if (results.length === 0) {
      console.log('Совпадений не найдено.');
    } else {
      console.log(`Найдено совпадений: ${results.length}\n`);
      results.forEach((result, index) => {
        console.log(`${index + 1}. ID: ${result.id}`);
        console.log(`   Название: ${result.title}`);
        console.log(`   Автор: ${result.author}`);
        console.log(`   Совпадения в полях: ${result.matches.join(', ')}`);
        console.log('');
      });
    }
  })
  .catch(error => {
    console.error('Ошибка при выполнении поиска:', error.message);
    process.exit(1);
  });
