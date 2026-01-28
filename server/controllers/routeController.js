const { Route } = require('../models');
const { Op } = require('sequelize');

// Вспомогательная функция для построения запроса с фильтрацией и поиском
const buildQuery = (query) => {
  const { search, status, origin, destination, minDistance, maxDistance, minTime, maxTime } = query;
  const where = {};

  // Поиск по нескольким полям
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { origin: { [Op.iLike]: `%${search}%` } },
      { destination: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Фильтрация по статусу
  if (status) {
    where.status = status;
  }

  // Фильтрация по точке отправления
  if (origin) {
    where.origin = { [Op.iLike]: `%${origin}%` };
  }

  // Фильтрация по точке назначения
  if (destination) {
    where.destination = { [Op.iLike]: `%${destination}%` };
  }

  // Фильтрация по расстоянию
  if (minDistance || maxDistance) {
    where.distance = {};
    if (minDistance) where.distance[Op.gte] = parseFloat(minDistance);
    if (maxDistance) where.distance[Op.lte] = parseFloat(maxDistance);
  }

  // Фильтрация по времени
  if (minTime || maxTime) {
    where.estimatedTime = {};
    if (minTime) where.estimatedTime[Op.gte] = parseInt(minTime);
    if (maxTime) where.estimatedTime[Op.lte] = parseInt(maxTime);
  }

  return where;
};

// Создание нового маршрута
exports.create = async (req, res) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json(route);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Ошибка при создании маршрута' });
  }
};

// Получение списка маршрутов с пагинацией, сортировкой, фильтрацией и поиском
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
    const allowedSortFields = ['id', 'name', 'origin', 'destination', 'distance', 'estimatedTime', 'status', 'createdAt', 'updatedAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'id';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const { count, rows } = await Route.findAndCountAll({
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
    res.status(500).json({ error: 'Ошибка при получении списка маршрутов' });
  }
};

// Получение маршрута по ID
exports.getById = async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Маршрут не найден' });
    }
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении маршрута' });
  }
};

// Обновление маршрута
exports.update = async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Маршрут не найден' });
    }

    await route.update(req.body);
    res.json(route);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Ошибка при обновлении маршрута' });
  }
};

// Удаление маршрута
exports.delete = async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Маршрут не найден' });
    }

    await route.destroy();
    res.json({ message: 'Маршрут успешно удален' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении маршрута' });
  }
};

// Проверка существования маршрута
exports.exists = async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    res.json({ exists: !!route });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при проверке существования маршрута' });
  }
};
