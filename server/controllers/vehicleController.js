const { Vehicle } = require('../models');
const { Op } = require('sequelize');

// Вспомогательная функция для построения запроса с фильтрацией и поиском
const buildQuery = (query) => {
  const { search, status, vehicleType, minCapacity, maxCapacity, minYear, maxYear } = query;
  const where = {};

  // Поиск по нескольким полям
  if (search) {
    where[Op.or] = [
      { licensePlate: { [Op.iLike]: `%${search}%` } },
      { brand: { [Op.iLike]: `%${search}%` } },
      { model: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Фильтрация по статусу
  if (status) {
    where.status = status;
  }

  // Фильтрация по типу транспортного средства
  if (vehicleType) {
    where.vehicleType = vehicleType;
  }

  // Фильтрация по грузоподъемности
  if (minCapacity || maxCapacity) {
    where.capacity = {};
    if (minCapacity) where.capacity[Op.gte] = parseFloat(minCapacity);
    if (maxCapacity) where.capacity[Op.lte] = parseFloat(maxCapacity);
  }

  // Фильтрация по году
  if (minYear || maxYear) {
    where.year = {};
    if (minYear) where.year[Op.gte] = parseInt(minYear);
    if (maxYear) where.year[Op.lte] = parseInt(maxYear);
  }

  return where;
};

// Создание нового транспортного средства
exports.create = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Транспортное средство с таким номерным знаком уже существует' });
    }
    res.status(500).json({ error: 'Ошибка при создании транспортного средства' });
  }
};

// Получение списка транспортных средств с пагинацией, сортировкой, фильтрацией и поиском
exports.getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'ASC',
      ...filters
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = buildQuery(filters);

    // Валидация сортировки
    const allowedSortFields = ['id', 'licensePlate', 'brand', 'model', 'vehicleType', 'capacity', 'status', 'year', 'createdAt', 'updatedAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'id';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const { count, rows } = await Vehicle.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortField, order]]
    });

    res.json({
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении списка транспортных средств' });
  }
};

// Получение транспортного средства по ID
exports.getById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Транспортное средство не найдено' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении транспортного средства' });
  }
};

// Обновление транспортного средства
exports.update = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Транспортное средство не найдено' });
    }

    await vehicle.update(req.body);
    res.json(vehicle);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Транспортное средство с таким номерным знаком уже существует' });
    }
    res.status(500).json({ error: 'Ошибка при обновлении транспортного средства' });
  }
};

// Удаление транспортного средства
exports.delete = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Транспортное средство не найдено' });
    }

    await vehicle.destroy();
    res.json({ message: 'Транспортное средство успешно удалено' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении транспортного средства' });
  }
};

// Проверка доступности транспортного средства на дату
exports.checkAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Транспортное средство не найдено' });
    }

    // Проверка статуса транспортного средства
    if (vehicle.status !== 'available') {
      return res.json({ available: false, reason: 'Транспортное средство не доступно' });
    }

    // Проверка наличия других грузоперевозок на эту дату
    const { Shipment } = require('../models');
    const checkDate = new Date(date);
    const startOfDay = new Date(checkDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(checkDate.setHours(23, 59, 59, 999));

    const conflictingShipments = await Shipment.count({
      where: {
        vehicleId: id,
        status: { [Op.in]: ['pending', 'in_transit'] },
        departureDate: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    const available = conflictingShipments === 0;
    res.json({ available, reason: available ? 'Доступно' : 'Уже используется в другой грузоперевозке' });
  } catch (error) {
    console.error('Ошибка при проверке доступности:', error);
    res.status(500).json({ error: 'Ошибка при проверке доступности транспортного средства' });
  }
};

// Проверка существования транспортного средства
exports.exists = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    res.json({ exists: !!vehicle });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при проверке существования транспортного средства' });
  }
};
