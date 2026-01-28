const { Shipment, Vehicle, Route } = require('../models');
const { Sequelize } = require('sequelize');

// Статистика по грузоперевозкам по месяцам
exports.getShipmentsByMonth = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where = {};
    if (startDate) {
      where.departureDate = { [Sequelize.Op.gte]: startDate };
    }
    if (endDate) {
      where.departureDate = {
        ...where.departureDate,
        [Sequelize.Op.lte]: endDate
      };
    }

    const shipments = await Shipment.findAll({
      where,
      attributes: [
        [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('departureDate')), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        [Sequelize.fn('SUM', Sequelize.col('weight')), 'totalWeight']
      ],
      group: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('departureDate'))],
      order: [[Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('departureDate')), 'ASC']],
      raw: true
    });

    // Форматирование данных для графика
    const data = shipments.map(item => ({
      month: new Date(item.month).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }),
      count: parseInt(item.count),
      totalWeight: parseFloat(item.totalWeight || 0)
    }));

    res.json(data);
  } catch (error) {
    console.error('Ошибка при получении статистики по месяцам:', error);
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
};

// Распределение грузоперевозок по статусам
exports.getShipmentsByStatus = async (req, res) => {
  try {
    const shipments = await Shipment.findAll({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        [Sequelize.fn('SUM', Sequelize.col('weight')), 'totalWeight']
      ],
      group: ['status'],
      raw: true
    });

    const statusNames = {
      'pending': 'Ожидает',
      'in_transit': 'В пути',
      'delivered': 'Доставлено',
      'cancelled': 'Отменено'
    };

    const data = shipments.map(item => ({
      status: statusNames[item.status] || item.status,
      statusKey: item.status,
      count: parseInt(item.count),
      totalWeight: parseFloat(item.totalWeight || 0)
    }));

    res.json(data);
  } catch (error) {
    console.error('Ошибка при получении статистики по статусам:', error);
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
};

// Топ маршрутов по количеству перевозок
exports.getTopRoutes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const routes = await Route.findAll({
      attributes: [
        'id',
        'name',
        'origin',
        'destination',
        [Sequelize.fn('COUNT', Sequelize.col('shipments.id')), 'shipmentCount'],
        [Sequelize.fn('SUM', Sequelize.col('shipments.weight')), 'totalWeight']
      ],
      include: [{
        model: Shipment,
        as: 'shipments',
        attributes: [],
        required: false
      }],
      group: ['Route.id', 'Route.name', 'Route.origin', 'Route.destination'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('shipments.id')), 'DESC']],
      limit,
      raw: false
    });

    const data = routes.map(route => ({
      id: route.id,
      name: route.name,
      route: `${route.origin} → ${route.destination}`,
      shipmentCount: parseInt(route.dataValues.shipmentCount || 0),
      totalWeight: parseFloat(route.dataValues.totalWeight || 0)
    }));

    res.json(data);
  } catch (error) {
    console.error('Ошибка при получении топ маршрутов:', error);
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
};

// Распределение транспортных средств по типам
exports.getVehiclesByType = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      attributes: [
        'vehicleType',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        [Sequelize.fn('SUM', Sequelize.col('capacity')), 'totalCapacity']
      ],
      group: ['vehicleType'],
      raw: true
    });

    const typeNames = {
      'truck': 'Грузовики',
      'van': 'Фургоны',
      'car': 'Автомобили',
      'motorcycle': 'Мотоциклы'
    };

    const data = vehicles.map(item => ({
      type: typeNames[item.vehicleType] || item.vehicleType,
      typeKey: item.vehicleType,
      count: parseInt(item.count),
      totalCapacity: parseFloat(item.totalCapacity || 0)
    }));

    res.json(data);
  } catch (error) {
    console.error('Ошибка при получении статистики по типам транспорта:', error);
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
};

// Общая статистика для дашборда
exports.getDashboardStats = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.count();
    const totalRoutes = await Route.count();
    const totalShipments = await Shipment.count();
    
    const activeVehicles = await Vehicle.count({ where: { status: 'available' } });
    const activeRoutes = await Route.count({ where: { status: 'active' } });
    const deliveredShipments = await Shipment.count({ where: { status: 'delivered' } });
    
    const totalWeight = await Shipment.sum('weight') || 0;
    const totalCapacity = await Vehicle.sum('capacity') || 0;

    res.json({
      vehicles: {
        total: totalVehicles,
        active: activeVehicles,
        totalCapacity: parseFloat(totalCapacity)
      },
      routes: {
        total: totalRoutes,
        active: activeRoutes
      },
      shipments: {
        total: totalShipments,
        delivered: deliveredShipments,
        totalWeight: parseFloat(totalWeight)
      }
    });
  } catch (error) {
    console.error('Ошибка при получении общей статистики:', error);
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
};
