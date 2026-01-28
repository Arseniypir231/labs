import readline from 'readline';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
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

async function searchBooks(criteria, value) {
  try {
    const index = await loadIndex();
    const results = [];

    for (const entry of index) {
      const filePath = path.join(DATA_DIR, entry.filename);
      try {
        const bookData = await fs.readFile(filePath, 'utf-8');
        const book = JSON.parse(bookData);

        let match = false;
        const searchValue = value.toLowerCase();

        switch (criteria.toLowerCase()) {
          case 'название':
          case 'title':
            match = book.title && book.title.toLowerCase().includes(searchValue);
            break;
          case 'автор':
          case 'author':
            match = book.author && book.author.toLowerCase().includes(searchValue);
            break;
          case 'isbn':
            match = book.isbn && book.isbn.toLowerCase().includes(searchValue);
            break;
          case 'год':
          case 'year':
            match = book.year && book.year.toString().includes(searchValue);
            break;
          case 'id':
            match = book.id && book.id.includes(searchValue);
            break;
          default:
            // Полнотекстовый поиск по всем полям
            const searchText = JSON.stringify(book).toLowerCase();
            match = searchText.includes(searchValue);
        }

        if (match) {
          results.push(book);
        }
      } catch (error) {
        // Пропускаем файлы, которые не удалось прочитать
        continue;
      }
    }

    return results;
  } catch (error) {
    throw error;
  }
}

function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    console.log('=== Поиск книг в каталоге ===\n');
    
    const criteria = await askQuestion(
      rl,
      'Введите критерий поиска (например, название книги, автор, ISBN, год, ID или оставьте пустым для полнотекстового поиска): '
    );

    const value = await askQuestion(
      rl,
      'Введите значение для поиска: '
    );

    rl.close();

    if (!value.trim()) {
      console.log('Значение для поиска не указано.');
      process.exit(0);
    }

    console.log(`\nВыполняется поиск...\n`);
    const results = await searchBooks(criteria.trim() || 'all', value);

    if (results.length === 0) {
      console.log('Совпадений не найдено.');
    } else {
      console.log(`Найдено совпадений: ${results.length}\n`);
      results.forEach((book, index) => {
        console.log(`${index + 1}. ID: ${book.id}`);
        console.log(`   Название: ${book.title}`);
        console.log(`   Автор: ${book.author}`);
        console.log(`   ISBN: ${book.isbn}`);
        console.log(`   Год издания: ${book.year}`);
        console.log('');
      });
    }
  } catch (error) {
    rl.close();
    console.error('Ошибка при выполнении поиска:', error.message);
    process.exit(1);
  }
}

main();
