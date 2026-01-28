const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');

router.post('/', shipmentController.create);
router.get('/', shipmentController.getAll);
router.get('/:id', shipmentController.getById);
router.put('/:id', shipmentController.update);
router.delete('/:id', shipmentController.delete);
router.get('/:id/exists', shipmentController.exists);

module.exports = router;
