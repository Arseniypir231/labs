const { Shipment, Vehicle, Route } = require('../models');
const { Op } = require('sequelize');

// Вспомогательная функция для построения запроса с фильтрацией и поиском
const buildQuery = (query) => {
  const { search, status, vehicleId, routeId, minWeight, maxWeight, departureDateFrom, departureDateTo } = query;
  const where = {};

  // Поиск по нескольким полям
  if (search) {
    where[Op.or] = [
      { cargoDescription: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Фильтрация по статусу
  if (status) {
    where.status = status;
  }

  // Фильтрация по транспортному средству
  if (vehicleId) {
    where.vehicleId = parseInt(vehicleId);
  }

  // Фильтрация по маршруту
  if (routeId) {
    where.routeId = parseInt(routeId);
  }

  // Фильтрация по весу
  if (minWeight || maxWeight) {
    where.weight = {};
    if (minWeight) where.weight[Op.gte] = parseFloat(minWeight);
    if (maxWeight) where.weight[Op.lte] = parseFloat(maxWeight);
  }

  // Фильтрация по дате отправления
  if (departureDateFrom || departureDateTo) {
    where.departureDate = {};
    if (departureDateFrom) where.departureDate[Op.gte] = departureDateFrom;
    if (departureDateTo) where.departureDate[Op.lte] = departureDateTo;
  }

  return where;
};

// Создание новой грузоперевозки
exports.create = async (req, res) => {
  try {
    // Проверка существования транспортного средства и маршрута
    const vehicle = await Vehicle.findByPk(req.body.vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: 'Транспортное средство не найдено' });
    }

    const route = await Route.findByPk(req.body.routeId);
    if (!route) {
      return res.status(404).json({ error: 'Маршрут не найден' });
    }

    const shipment = await Shipment.create(req.body);
    const shipmentWithRelations = await Shipment.findByPk(shipment.id, {
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: Route, as: 'route' }
      ]
    });

    res.status(201).json(shipmentWithRelations);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Ошибка при создании грузоперевозки' });
  }
};

// Получение списка грузоперевозок с пагинацией, сортировкой, фильтрацией и поиском
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
    const allowedSortFields = ['id', 'vehicleId', 'routeId', 'cargoDescription', 'weight', 'status', 'departureDate', 'deliveryDate', 'createdAt', 'updatedAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'id';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const { count, rows } = await Shipment.findAndCountAll({
      where,
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: Route, as: 'route' }
      ],
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
    res.status(500).json({ error: 'Ошибка при получении списка грузоперевозок' });
  }
};

// Получение грузоперевозки по ID
exports.getById = async (req, res) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id, {
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: Route, as: 'route' }
      ]
    });
    if (!shipment) {
      return res.status(404).json({ error: 'Грузоперевозка не найдена' });
    }
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении грузоперевозки' });
  }
};

// Обновление грузоперевозки
exports.update = async (req, res) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id);
    if (!shipment) {
      return res.status(404).json({ error: 'Грузоперевозка не найдена' });
    }

    // Проверка существования транспортного средства и маршрута при обновлении
    if (req.body.vehicleId) {
      const vehicle = await Vehicle.findByPk(req.body.vehicleId);
      if (!vehicle) {
        return res.status(404).json({ error: 'Транспортное средство не найдено' });
      }
    }

    if (req.body.routeId) {
      const route = await Route.findByPk(req.body.routeId);
      if (!route) {
        return res.status(404).json({ error: 'Маршрут не найден' });
      }
    }

    await shipment.update(req.body);
    const updatedShipment = await Shipment.findByPk(shipment.id, {
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: Route, as: 'route' }
      ]
    });

    res.json(updatedShipment);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Ошибка при обновлении грузоперевозки' });
  }
};

// Удаление грузоперевозки
exports.delete = async (req, res) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id);
    if (!shipment) {
      return res.status(404).json({ error: 'Грузоперевозка не найдена' });
    }

    await shipment.destroy();
    res.json({ message: 'Грузоперевозка успешно удалена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении грузоперевозки' });
  }
};

// Проверка существования грузоперевозки
exports.exists = async (req, res) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id);
    res.json({ exists: !!shipment });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при проверке существования грузоперевозки' });
  }
};
