-- SQL скрипт для заполнения базы данных тестовыми данными
-- Минимум 50 записей в совокупности по всем сущностям

-- Очистка таблиц (опционально, раскомментируйте если нужно очистить перед заполнением)
-- TRUNCATE TABLE shipments CASCADE;
-- TRUNCATE TABLE vehicles CASCADE;
-- TRUNCATE TABLE routes CASCADE;

-- Вставка транспортных средств (20 записей)
INSERT INTO vehicles (license_plate, brand, model, vehicle_type, capacity, status, year, photo_url, created_at, updated_at) VALUES
('А123БВ777', 'Mercedes-Benz', 'Actros', 'truck', 20.50, 'available', 2020, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', NOW(), NOW()),
('В456ГД123', 'Volvo', 'FH16', 'truck', 25.00, 'in_use', 2021, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500', NOW(), NOW()),
('С789ЕЖ456', 'MAN', 'TGX', 'truck', 18.75, 'available', 2019, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500', NOW(), NOW()),
('Д012ЗИ789', 'Scania', 'R450', 'truck', 22.00, 'maintenance', 2022, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', NOW(), NOW()),
('Е345КЛ012', 'Mercedes-Benz', 'Sprinter', 'van', 3.50, 'available', 2021, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500', NOW(), NOW()),
('Ж678МН345', 'Ford', 'Transit', 'van', 2.80, 'in_use', 2020, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500', NOW(), NOW()),
('З901НО678', 'Volkswagen', 'Crafter', 'van', 3.20, 'available', 2022, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500', NOW(), NOW()),
('И234ПР901', 'Renault', 'Master', 'van', 2.50, 'available', 2019, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500', NOW(), NOW()),
('К567СТ234', 'Toyota', 'Camry', 'car', 0.50, 'available', 2021, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500', NOW(), NOW()),
('Л890ТУ567', 'Honda', 'Accord', 'car', 0.45, 'in_use', 2020, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500', NOW(), NOW()),
('М123ФХ890', 'BMW', '5 Series', 'car', 0.55, 'available', 2022, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500', NOW(), NOW()),
('Н456ЦЧ123', 'Audi', 'A6', 'car', 0.50, 'maintenance', 2021, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500', NOW(), NOW()),
('О789ШЩ456', 'Yamaha', 'FJR1300', 'motorcycle', 0.20, 'available', 2020, 'https://images.unsplash.com/photo-1558980663-3681c1f639e6?w=500', NOW(), NOW()),
('П012ЪЫ789', 'Honda', 'Gold Wing', 'motorcycle', 0.25, 'in_use', 2021, 'https://images.unsplash.com/photo-1558980663-3681c1f639e6?w=500', NOW(), NOW()),
('Р345ЬЭ012', 'Kawasaki', 'Ninja 1000', 'motorcycle', 0.15, 'available', 2022, 'https://images.unsplash.com/photo-1558980663-3681c1f639e6?w=500', NOW(), NOW()),
('С678ЮЯ345', 'Mercedes-Benz', 'Atego', 'truck', 12.00, 'available', 2018, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', NOW(), NOW()),
('Т901АБ678', 'Iveco', 'Daily', 'van', 3.00, 'available', 2020, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500', NOW(), NOW()),
('У234ВГ901', 'Hyundai', 'Santa Fe', 'car', 0.60, 'available', 2021, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500', NOW(), NOW()),
('Ф567ДЕ234', 'Ducati', 'Multistrada', 'motorcycle', 0.18, 'retired', 2019, 'https://images.unsplash.com/photo-1558980663-3681c1f639e6?w=500', NOW(), NOW()),
('Х890ЖЗ567', 'KamAZ', '65117', 'truck', 15.00, 'available', 2020, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', NOW(), NOW());

-- Вставка маршрутов (15 записей)
INSERT INTO routes (name, origin, destination, distance, estimated_time, status, photo_url, created_at, updated_at) VALUES
('Москва - Санкт-Петербург', 'Москва', 'Санкт-Петербург', 700.50, 480, 'active', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', NOW(), NOW()),
('Москва - Казань', 'Москва', 'Казань', 820.00, 600, 'active', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', NOW(), NOW()),
('Санкт-Петербург - Новосибирск', 'Санкт-Петербург', 'Новосибирск', 3340.00, 2880, 'active', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', NOW(), NOW()),
('Москва - Нижний Новгород', 'Москва', 'Нижний Новгород', 420.00, 300, 'active', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', NOW(), NOW()),
('Казань - Екатеринбург', 'Казань', 'Екатеринбург', 525.00, 360, 'active', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', NOW(), NOW()),
('Москва - Ростов-на-Дону', 'Москва', 'Ростов-на-Дону', 1090.00, 720, 'active', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', NOW(), NOW()),
('Санкт-Петербург - Мурманск', 'Санкт-Петербург', 'Мурманск', 1380.00, 900, 'active', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', NOW(), NOW()),
('Москва - Воронеж', 'Москва', 'Воронеж', 515.00, 360, 'active', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', NOW(), NOW()),
('Екатеринбург - Челябинск', 'Екатеринбург', 'Челябинск', 200.00, 120, 'active', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', NOW(), NOW()),
('Москва - Ярославль', 'Москва', 'Ярославль', 265.00, 180, 'inactive', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', NOW(), NOW()),
('Новосибирск - Омск', 'Новосибирск', 'Омск', 640.00, 420, 'active', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', NOW(), NOW()),
('Москва - Тула', 'Москва', 'Тула', 185.00, 120, 'active', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', NOW(), NOW()),
('Казань - Самара', 'Казань', 'Самара', 350.00, 240, 'active', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', NOW(), NOW()),
('Москва - Смоленск', 'Москва', 'Смоленск', 405.00, 270, 'archived', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', NOW(), NOW()),
('Санкт-Петербург - Псков', 'Санкт-Петербург', 'Псков', 290.00, 180, 'active', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', NOW(), NOW());

-- Вставка грузоперевозок (25 записей)
-- Примечание: vehicle_id и route_id должны соответствовать существующим записям
INSERT INTO shipments (vehicle_id, route_id, cargo_description, weight, status, departure_date, delivery_date, photo_url, created_at, updated_at) VALUES
(1, 1, 'Электроника и бытовая техника', 15.50, 'delivered', '2024-01-15 10:00:00', '2024-01-16 18:00:00', 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=500', NOW(), NOW()),
(2, 2, 'Мебель и предметы интерьера', 22.00, 'in_transit', '2024-01-20 08:00:00', '2024-01-21 20:00:00', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', NOW(), NOW()),
(3, 3, 'Промышленное оборудование', 18.75, 'pending', '2024-02-01 06:00:00', NULL, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500', NOW(), NOW()),
(4, 4, 'Продукты питания и напитки', 12.30, 'delivered', '2024-01-10 09:00:00', '2024-01-10 15:00:00', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500', NOW(), NOW()),
(5, 5, 'Одежда и текстиль', 2.80, 'in_transit', '2024-01-25 11:00:00', '2024-01-26 14:00:00', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500', NOW(), NOW()),
(6, 6, 'Строительные материалы', 2.50, 'delivered', '2024-01-12 07:00:00', '2024-01-13 16:00:00', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500', NOW(), NOW()),
(7, 7, 'Химические вещества', 3.20, 'pending', '2024-02-05 10:00:00', NULL, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500', NOW(), NOW()),
(8, 8, 'Автозапчасти', 2.00, 'delivered', '2024-01-18 08:00:00', '2024-01-18 14:00:00', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500', NOW(), NOW()),
(1, 9, 'Медицинское оборудование', 20.00, 'in_transit', '2024-01-28 06:00:00', '2024-01-28 12:00:00', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500', NOW(), NOW()),
(2, 10, 'Книги и печатная продукция', 18.50, 'cancelled', '2024-01-22 09:00:00', NULL, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500', NOW(), NOW()),
(3, 11, 'Спортивный инвентарь', 16.80, 'delivered', '2024-01-14 10:00:00', '2024-01-15 18:00:00', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', NOW(), NOW()),
(4, 12, 'Игрушки и детские товары', 14.20, 'in_transit', '2024-01-30 08:00:00', '2024-01-30 12:00:00', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', NOW(), NOW()),
(5, 13, 'Косметика и парфюмерия', 2.60, 'delivered', '2024-01-16 11:00:00', '2024-01-17 15:00:00', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500', NOW(), NOW()),
(6, 14, 'Металлопрокат', 2.40, 'pending', '2024-02-08 07:00:00', NULL, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500', NOW(), NOW()),
(7, 15, 'Компьютерная техника', 3.00, 'delivered', '2024-01-19 09:00:00', '2024-01-20 17:00:00', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', NOW(), NOW()),
(8, 1, 'Сельскохозяйственная продукция', 2.30, 'in_transit', '2024-01-27 06:00:00', '2024-01-28 14:00:00', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500', NOW(), NOW()),
(1, 2, 'Фармацевтическая продукция', 19.50, 'delivered', '2024-01-11 08:00:00', '2024-01-12 16:00:00', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500', NOW(), NOW()),
(2, 3, 'Автомобили', 17.00, 'pending', '2024-02-10 10:00:00', NULL, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500', NOW(), NOW()),
(3, 4, 'Холодильное оборудование', 15.80, 'in_transit', '2024-01-29 07:00:00', '2024-01-30 13:00:00', 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=500', NOW(), NOW()),
(4, 5, 'Товары для животных', 13.50, 'delivered', '2024-01-13 09:00:00', '2024-01-14 15:00:00', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500', NOW(), NOW()),
(5, 6, 'Ювелирные изделия', 0.50, 'delivered', '2024-01-17 11:00:00', '2024-01-18 19:00:00', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500', NOW(), NOW()),
(6, 7, 'Офисная мебель', 2.20, 'in_transit', '2024-01-31 08:00:00', '2024-02-01 16:00:00', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', NOW(), NOW()),
(7, 8, 'Бытовая химия', 2.90, 'delivered', '2024-01-21 10:00:00', '2024-01-21 16:00:00', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500', NOW(), NOW()),
(8, 9, 'Сантехника', 11.20, 'pending', '2024-02-12 06:00:00', NULL, 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500', NOW(), NOW()),
(1, 10, 'Музыкальные инструменты', 1.80, 'delivered', '2024-01-23 09:00:00', '2024-01-24 17:00:00', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500', NOW(), NOW());

-- Проверка количества записей
SELECT 
    'vehicles' as table_name, COUNT(*) as record_count FROM vehicles
UNION ALL
SELECT 
    'routes' as table_name, COUNT(*) as record_count FROM routes
UNION ALL
SELECT 
    'shipments' as table_name, COUNT(*) as record_count FROM shipments;
