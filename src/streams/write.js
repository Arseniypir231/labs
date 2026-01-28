import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function writeDataToFile(filePath, data) {
  return new Promise((resolve, reject) => {
    // Создаем Writable Stream
    const writeStream = fs.createWriteStream(filePath, { 
      encoding: 'utf8',
      flags: 'a' // append mode
    });

    // Записываем данные
    const dataString = Array.isArray(data) 
      ? data.map(item => JSON.stringify(item)).join('\n') + '\n'
      : JSON.stringify(data) + '\n';

    writeStream.write(dataString, (error) => {
      if (error) {
        reject(error);
        return;
      }
    });

    writeStream.on('finish', () => {
      console.log(`Данные успешно записаны в файл: ${filePath}`);
      resolve();
    });

    writeStream.on('error', (error) => {
      reject(error);
    });

    // Завершаем поток
    writeStream.end();
  });
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Использование: node write.js <путь_к_файлу> [данные...]');
  console.error('Пример: node write.js output.json "{\\"title\\":\\"Книга\\",\\"author\\":\\"Автор\\"}"');
  process.exit(1);
}

const filePath = path.isAbsolute(args[0]) ? args[0] : path.resolve(process.cwd(), args[0]);
const dataToWrite = args.slice(1);

// Если данные переданы как аргументы, записываем их
if (dataToWrite.length > 0) {
  const data = dataToWrite.map(item => {
    try {
      return JSON.parse(item);
    } catch {
      return { content: item };
    }
  });

  writeDataToFile(filePath, data)
    .catch(error => {
      console.error('Ошибка при записи файла:', error.message);
      process.exit(1);
    });
} else {
  // Если данных нет, читаем из stdin
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const data = [];
  
  console.log('Введите данные для записи (по одной строке, пустая строка для завершения):');
  
  rl.on('line', (line) => {
    if (line.trim() === '') {
      rl.close();
      writeDataToFile(filePath, data)
        .catch(error => {
          console.error('Ошибка при записи файла:', error.message);
          process.exit(1);
        });
    } else {
      try {
        data.push(JSON.parse(line));
      } catch {
        data.push({ content: line });
      }
    }
  });
}
