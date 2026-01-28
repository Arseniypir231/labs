const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

router.post('/', routeController.create);
router.get('/', routeController.getAll);
router.get('/:id', routeController.getById);
router.put('/:id', routeController.update);
router.delete('/:id', routeController.delete);
router.get('/:id/exists', routeController.exists);

module.exports = router;
