import { Transform } from 'stream';
import fs from 'fs';
import path from 'path';

class BookTransform extends Transform {
  constructor(options = {}) {
    super({ objectMode: true, ...options });
  }

  _transform(chunk, encoding, callback) {
    try {
      // Преобразуем данные
      const data = chunk.toString();
      
      // Пытаемся распарсить JSON
      let book;
      try {
        book = JSON.parse(data);
      } catch {
        // Если не JSON, создаем объект из строки
        book = { content: data };
      }

      // Преобразуем формат записи о книге
      const transformed = {
        id: book.id || 'unknown',
        metadata: {
          title: book.title || book.content || 'Без названия',
          author: book.author || 'Неизвестный автор',
          isbn: book.isbn || '',
          year: book.year || null
        },
        fileInfo: {
          originalFilename: book.filename || 'unknown',
          transformedAt: new Date().toISOString()
        }
      };

      // Отправляем преобразованные данные
      this.push(JSON.stringify(transformed) + '\n');
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

function transformFile(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    // Проверяем существование входного файла
    if (!fs.existsSync(inputPath)) {
      reject(new Error(`Входной файл не найден: ${inputPath}`));
      return;
    }

    // Создаем потоки
    const readStream = fs.createReadStream(inputPath, { encoding: 'utf8' });
    const transformStream = new BookTransform();
    const writeStream = fs.createWriteStream(outputPath, { encoding: 'utf8' });

    // Обрабатываем данные построчно
    let buffer = '';
    
    readStream.on('data', (chunk) => {
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      lines.forEach(line => {
        if (line.trim()) {
          transformStream.write(line);
        }
      });
    });

    readStream.on('end', () => {
      if (buffer.trim()) {
        transformStream.write(buffer);
      }
      transformStream.end();
    });

    // Подключаем transform stream к write stream
    transformStream.pipe(writeStream);

    writeStream.on('finish', () => {
      console.log(`Преобразование завершено. Результат сохранен в: ${outputPath}`);
      resolve();
    });

    readStream.on('error', reject);
    transformStream.on('error', reject);
    writeStream.on('error', reject);
  });
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Использование: node transform.js <входной_файл> <выходной_файл>');
  console.error('Или для чтения из stdin: echo \'{"title":"Книга"}\' | node transform.js - <выходной_файл>');
  process.exit(1);
}

const [inputPath, outputPath] = args;

if (inputPath === '-') {
  // Читаем из stdin
  const transformStream = new BookTransform();
  const writeStream = fs.createWriteStream(outputPath, { encoding: 'utf8' });
  
  process.stdin.pipe(transformStream).pipe(writeStream);
  
  writeStream.on('finish', () => {
    console.log(`Преобразование завершено. Результат сохранен в: ${outputPath}`);
  });
  
  process.stdin.on('error', (error) => {
    console.error('Ошибка при чтении из stdin:', error.message);
    process.exit(1);
  });
} else {
  const resolvedInputPath = path.isAbsolute(inputPath) 
    ? inputPath 
    : path.resolve(process.cwd(), inputPath);
  const resolvedOutputPath = path.isAbsolute(outputPath)
    ? outputPath
    : path.resolve(process.cwd(), outputPath);

  transformFile(resolvedInputPath, resolvedOutputPath)
    .catch(error => {
      console.error('Ошибка при преобразовании файла:', error.message);
      process.exit(1);
    });
}
