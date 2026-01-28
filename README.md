# Лабораторная работа: Файловая система, потоки и worker threads

Приложение для работы с файловой системой, потоками и worker threads в Node.js.

## Структура проекта

```
src/
├── fs/          # Операции с файловой системой
├── streams/     # Работа с потоками
├── wt/          # Worker threads
└── search.js    # CLI поиск
```

## Установка

```bash
npm install
```

## Использование

### Файловая система (src/fs)

#### Создание записи
```bash
node src/fs/create.js "Название книги" "Автор книги" "ISBN" "Год издания"
```

#### Список всех записей
```bash
node src/fs/list.js
```

#### Чтение записи
```bash
node src/fs/read.js <ID_записи>
```

#### Удаление записи
```bash
node src/fs/delete.js <ID_записи>
```

#### Переименование файла
```bash
node src/fs/rename.js <старое_имя> <новое_имя>
```

#### Резервное копирование
```bash
node src/fs/copy.js <исходная_папка> <целевая_папка>
```

### Потоки (src/streams)

#### Чтение большого файла
```bash
node src/streams/read.js <путь_к_файлу>
```

#### Запись данных
```bash
node src/streams/write.js <путь_к_файлу> [данные...]
```

#### Преобразование данных
```bash
node src/streams/transform.js <входной_файл> <выходной_файл>
# Или из stdin:
echo '{"title":"Книга"}' | node src/streams/transform.js - <выходной_файл>
```

### Worker Threads (src/wt)

#### Полнотекстовый поиск
```bash
node src/wt/spawn.js <ключевое_слово>
```

### Поиск (CLI)

#### Интерактивный поиск
```bash
node src/search.js
```

## Формат данных

Данные хранятся в формате JSON:
- Файлы книг: `data/book_<ID>.json`
- Индекс: `data/book_index.json`
