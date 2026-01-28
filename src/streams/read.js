import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readLargeFile(filePath) {
  return new Promise((resolve, reject) => {
    // Проверяем существование файла
    if (!fs.existsSync(filePath)) {
      reject(new Error(`Файл не найден: ${filePath}`));
      return;
    }

    // Создаем Readable Stream
    const readStream = fs.createReadStream(filePath, { 
      encoding: 'utf8',
      highWaterMark: 64 * 1024 // 64KB chunks
    });

    let buffer = '';
    let lineCount = 0;

    readStream.on('data', (chunk) => {
      buffer += chunk;
      const lines = buffer.split('\n');
      
      // Обрабатываем все строки кроме последней (которая может быть неполной)
      buffer = lines.pop() || '';
      
      lines.forEach(line => {
        if (line.trim()) {
          lineCount++;
          console.log(`Строка ${lineCount}: ${line.substring(0, 100)}${line.length > 100 ? '...' : ''}`);
        }
      });
    });

    readStream.on('end', () => {
      // Обрабатываем последнюю строку
      if (buffer.trim()) {
        lineCount++;
        console.log(`Строка ${lineCount}: ${buffer.substring(0, 100)}${buffer.length > 100 ? '...' : ''}`);
      }
      console.log(`\nЧтение завершено. Всего строк: ${lineCount}`);
      resolve();
    });

    readStream.on('error', (error) => {
      reject(error);
    });
  });
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Использование: node read.js <путь_к_файлу>');
  process.exit(1);
}

const filePath = path.isAbsolute(args[0]) ? args[0] : path.resolve(process.cwd(), args[0]);

readLargeFile(filePath)
  .catch(error => {
    console.error('Ошибка при чтении файла:', error.message);
    process.exit(1);
  });
