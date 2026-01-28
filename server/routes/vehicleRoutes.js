const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authorize } = require('../middleware/auth');

// Все пользователи могут просматривать
router.get('/', vehicleController.getAll);
router.get('/:id/check-availability', vehicleController.checkAvailability);
router.get('/:id', vehicleController.getById);
router.get('/:id/exists', vehicleController.exists);

// Только admin и manager могут создавать, обновлять и удалять
router.post('/', authorize('admin', 'manager'), vehicleController.create);
router.put('/:id', authorize('admin', 'manager'), vehicleController.update);
router.delete('/:id', authorize('admin', 'manager'), vehicleController.delete);

module.exports = router;
