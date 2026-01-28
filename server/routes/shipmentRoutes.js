const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const { authorize } = require('../middleware/auth');

// Все пользователи могут просматривать
router.get('/', shipmentController.getAll);
router.get('/:id', shipmentController.getById);
router.get('/:id/exists', shipmentController.exists);

// Только admin и manager могут создавать, обновлять и удалять
router.post('/', authorize('admin', 'manager'), shipmentController.create);
router.put('/:id', authorize('admin', 'manager'), shipmentController.update);
router.delete('/:id', authorize('admin', 'manager'), shipmentController.delete);

module.exports = router;
