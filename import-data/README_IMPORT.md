# 📥 Инструкция по импорту данных в MongoDB Compass

## Шаг 1: Откройте MongoDB Compass

1. Запустите MongoDB Compass
2. Подключитесь к локальной базе данных:
   - Connection String: `mongodb://localhost:27017`
   - Нажмите "Connect"

## Шаг 2: Создайте базу данных

1. В левой панели нажмите "+" рядом с "Databases"
2. Введите имя базы данных: `transport_logistics`
3. Нажмите "Create Database"

## Шаг 3: Импорт коллекции Vehicles

1. Выберите базу данных `transport_logistics`
2. Нажмите "ADD DATA" → "Import File"
3. Выберите файл `vehicles.json`
4. Убедитесь, что:
   - Input Type: `JSON`
   - Import Mode: `Insert documents`
5. Нажмите "Import"
6. Должно импортироваться **20 записей**

## Шаг 4: Импорт коллекции Drivers

1. В той же базе данных нажмите "ADD DATA" → "Import File"
2. Выберите файл `drivers.json`
3. Убедитесь, что:
   - Input Type: `JSON`
   - Import Mode: `Insert documents`
4. Нажмите "Import"
5. Должно импортироваться **20 записей**

## Шаг 5: Импорт коллекции Deliveries

**ВАЖНО:** Сначала нужно получить ObjectId из импортированных vehicles и drivers!

### Вариант 1: Импорт с автоматической заменой (рекомендуется)

1. Откройте файл `deliveries.json` в текстовом редакторе
2. Замените все `"VEHICLE_ID_1"`, `"VEHICLE_ID_2"` и т.д. на реальные ObjectId из коллекции vehicles
3. Замените все `"DRIVER_ID_1"`, `"DRIVER_ID_2"` и т.д. на реальные ObjectId из коллекции drivers
4. Сохраните файл
5. Импортируйте в Compass

### Вариант 2: Использовать скрипт для генерации

Запустите скрипт `generate-deliveries.js` (см. ниже), который автоматически создаст deliveries с правильными ObjectId.

## Шаг 6: Проверка

После импорта вы должны увидеть:
- **vehicles**: 20 документов
- **drivers**: 20 документов  
- **deliveries**: 10 документов
- **Всего: 50 записей** ✅

---

## Альтернативный способ: Использование скрипта

Если импорт через Compass не работает, можно использовать скрипт:

```bash
node import-data/import-all.js
```

Этот скрипт автоматически импортирует все данные с правильными связями.
