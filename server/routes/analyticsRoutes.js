const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');

// Все эндпоинты аналитики требуют аутентификации
router.get('/shipments-by-month', authenticate, analyticsController.getShipmentsByMonth);
router.get('/shipments-by-status', authenticate, analyticsController.getShipmentsByStatus);
router.get('/top-routes', authenticate, analyticsController.getTopRoutes);
router.get('/vehicles-by-type', authenticate, analyticsController.getVehiclesByType);
router.get('/dashboard-stats', authenticate, analyticsController.getDashboardStats);

module.exports = router;
