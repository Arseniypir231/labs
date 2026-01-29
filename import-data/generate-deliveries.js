
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function generateDeliveries() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transport_logistics';
    await mongoose.connect(mongoURI);
    console.log('✅ Подключено к MongoDB\n');

    const Vehicle = require('../models/Vehicle');
    const Driver = require('../models/Driver');

    const vehicles = await Vehicle.find().limit(20);
    const drivers = await Driver.find().limit(20);

    if (vehicles.length === 0 || drivers.length === 0) {
      console.error('❌ Ошибка: Сначала импортируйте vehicles и drivers!');
      process.exit(1);
    }

    console.log(`📦 Найдено vehicles: ${vehicles.length}`);
    console.log(`👤 Найдено drivers: ${drivers.length}\n`);

    const deliveries = [
      {
        deliveryNumber: "DLV-000001",
        driver: drivers[0]._id.toString(),
        vehicle: vehicles[0]._id.toString(),
        origin: {
          address: "ул. Ленина, 1",
          city: "Москва"
        },
        destination: {
          address: "пр. Мира, 10",
          city: "Санкт-Петербург"
        },
        cargo: {
          description: "Мебель",
          weight: 2000,
          weightUnit: "kg",
          volume: 15,
          volumeUnit: "cubic_meters"
        },
        scheduledDate: "2024-12-20T10:00:00.000Z",
        status: "scheduled",
        distance: 700,
        distanceUnit: "km",
        cost: 50000,
        currency: "RUB"
      },
      {
        deliveryNumber: "DLV-000002",
        driver: drivers[1]._id.toString(),
        vehicle: vehicles[1]._id.toString(),
        origin: {
          address: "ул. Тверская, 10",
          city: "Москва"
        },
        destination: {
          address: "Невский пр., 50",
          city: "Санкт-Петербург"
        },
        cargo: {
          description: "Электроника",
          weight: 1500,
          weightUnit: "kg",
          volume: 8,
          volumeUnit: "cubic_meters"
        },
        scheduledDate: "2024-12-21T08:00:00.000Z",
        actualStartDate: "2024-12-21T08:15:00.000Z",
        status: "in_transit",
        distance: 650,
        distanceUnit: "km",
        cost: 45000,
        currency: "RUB"
      },
      {
        deliveryNumber: "DLV-000003",
        driver: drivers[2]._id.toString(),
        vehicle: vehicles[2]._id.toString(),
        origin: {
          address: "ул. Арбат, 20",
          city: "Москва"
        },
        destination: {
          address: "ул. Баумана, 58",
          city: "Казань"
        },
        cargo: {
          description: "Одежда",
          weight: 800,
          weightUnit: "kg",
          volume: 5,
          volumeUnit: "cubic_meters"
        },
        scheduledDate: "2024-12-19T12:00:00.000Z",
        actualStartDate: "2024-12-19T12:30:00.000Z",
        actualEndDate: "2024-12-19T20:00:00.000Z",
        status: "delivered",
        distance: 820,
        distanceUnit: "km",
        cost: 55000,
        currency: "RUB"
      },
      {
        deliveryNumber: "DLV-000004",
        driver: drivers[3]._id.toString(),
        vehicle: vehicles[3]._id.toString(),
        origin: {
          address: "Красный пр., 30",
          city: "Новосибирск"
        },
        destination: {
          address: "пр. Ленина, 50",
          city: "Екатеринбург"
        },
        cargo: {
          description: "Строительные материалы",
          weight: 5000,
          weightUnit: "kg",
          volume: 25,
          volumeUnit: "cubic_meters"
        },
        scheduledDate: "2024-12-22T06:00:00.000Z",
        status: "scheduled",
        distance: 1500,
        distanceUnit: "km",
        cost: 120000,
        currency: "RUB"
      },
      {
        deliveryNumber: "DLV-000005",
        driver: drivers[4]._id.toString(),
        vehicle: vehicles[4]._id.toString(),
        origin: {
          address: "ул. Садовая, 15",
          city: "Москва"
        },
        destination: {
          address: "ул. Пушкина, 8",
          city: "Москва"
        },
        cargo: {
          description: "Бытовая техника",
          weight: 1200,
          weightUnit: "kg",
          volume: 6,
          volumeUnit: "cubic_meters"
        },
        scheduledDate: "2024-12-18T14:00:00.000Z",
        actualStartDate: "2024-12-18T14:20:00.000Z",
        actualEndDate: "2024-12-18T16:30:00.000Z",
        status: "delivered",
        distance: 25,
        distanceUnit: "km",
        cost: 15000,
        currency: "RUB"
      },
      {
        deliveryNumber: "DLV-000006",
        driver: drivers[5]._id.toString(),
        vehicle: vehicles[5]._id.toString(),
        origin: {
          address: "ул. Большая Садовая, 100",
          city: "Ростов-на-Дону"
        },
        destination: {
          address: "ул. Кутузовский пр., 12",
          city: "Москва"
        },
        cargo: {
          description: "Продукты питания",
          weight: 3000,
          weightUnit: "kg",
          volume: 12,
          volumeUnit: "cubic_meters"
        },
        scheduledDate: "2024-12-23T09:00:00.000Z",
        status: "scheduled",
        distance: 1100,
        distanceUnit: "km",
        cost: 85000,
        currency: "RUB"
      },
      {
        deliveryNumber: "DLV-000007",
        driver: drivers[6]._id.toString(),
        vehicle: vehicles[6]._id.toString(),
        origin: {
          address: "Невский пр., 50",
          city: "Санкт-Петербург"
        },
        destination: {
          address: "ул. Московское ш., 18",
          city: "Самара"
        },
        cargo: {
          description: "Автозапчасти",
          weight: 2500,
          weightUnit: "kg",
          volume: 10,
          volumeUnit: "cubic_meters"
        },
        scheduledDate: "2024-12-20T11:00:00.000Z",
        actualStartDate: "2024-12-20T11:15:00.000Z",
        status: "in_transit",
        distance: 1600,
        distanceUnit: "km",
        cost: 130000,
        currency: "RUB"
      },
      {
        deliveryNumber: "DLV-000008",
        driver: drivers[7]._id.toString(),
        vehicle: vehicles[7]._id.toString(),
        origin: {
          address: "ул. Ломоносовский пр., 27",
          city: "Москва"
        },
        destination: {
          address: "пр. Революции, 33",
          city: "Воронеж"
        },
        cargo: {
          description: "Медицинское оборудование",
          weight: 1800,
          weightUnit: "kg",
          volume: 7,
          volumeUnit: "cubic_meters"
        },
        scheduledDate: "2024-12-21T07:00:00.000Z",
        status: "scheduled",
        distance: 520,
        distanceUnit: "km",
        cost: 40000,
        currency: "RUB"
      },
      {
        deliveryNumber: "DLV-000009",
        driver: drivers[8]._id.toString(),
        vehicle: vehicles[8]._id.toString(),
        origin: {
          address: "ул. Профсоюзная, 15",
          city: "Москва"
        },
        destination: {
          address: "ул. Красная, 122",
          city: "Краснодар"
        },
        cargo: {
          description: "Спортивный инвентарь",
          weight: 2200,
          weightUnit: "kg",
          volume: 9,
          volumeUnit: "cubic_meters"
        },
        scheduledDate: "2024-12-22T10:00:00.000Z",
        status: "scheduled",
        distance: 1350,
        distanceUnit: "km",
        cost: 95000,
        currency: "RUB"
      },
      {
        deliveryNumber: "DLV-000010",
        driver: drivers[9]._id.toString(),
        vehicle: vehicles[9]._id.toString(),
        origin: {
          address: "ул. Варшавское ш., 47",
          city: "Москва"
        },
        destination: {
          address: "ул. Покровка, 7",
          city: "Нижний Новгород"
        },
        cargo: {
          description: "Книги и канцтовары",
          weight: 1000,
          weightUnit: "kg",
          volume: 4,
          volumeUnit: "cubic_meters"
        },
        scheduledDate: "2024-12-19T13:00:00.000Z",
        actualStartDate: "2024-12-19T13:10:00.000Z",
        actualEndDate: "2024-12-19T19:45:00.000Z",
        status: "delivered",
        distance: 420,
        distanceUnit: "km",
        cost: 35000,
        currency: "RUB",
        notes: "Доставка выполнена в срок"
      }
    ];

    const filePath = path.join(__dirname, 'deliveries.json');
    fs.writeFileSync(filePath, JSON.stringify(deliveries, null, 2));
    
    console.log('✅ Файл deliveries.json создан!');
    console.log(`📦 Создано ${deliveries.length} записей доставок\n`);
    console.log('📋 Теперь импортируйте deliveries.json в MongoDB Compass\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

generateDeliveries();
