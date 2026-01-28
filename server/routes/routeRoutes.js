const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authorize } = require('../middleware/auth');

// Все пользователи могут просматривать
router.get('/', routeController.getAll);
router.get('/:id', routeController.getById);
router.get('/:id/exists', routeController.exists);

// Только admin и manager могут создавать, обновлять и удалять
router.post('/', authorize('admin', 'manager'), routeController.create);
router.put('/:id', authorize('admin', 'manager'), routeController.update);
router.delete('/:id', authorize('admin', 'manager'), routeController.delete);

module.exports = router;
