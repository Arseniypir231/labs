const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { authenticate } = require('../middleware/auth');

// Все эндпоинты экспорта требуют аутентификации
router.get('/shipments/excel', authenticate, exportController.exportShipmentsExcel);
router.get('/shipments/pdf', authenticate, exportController.exportShipmentsPDF);
router.get('/vehicles/excel', authenticate, exportController.exportVehiclesExcel);
router.get('/vehicles/pdf', authenticate, exportController.exportVehiclesPDF);

module.exports = router;
