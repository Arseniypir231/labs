const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.post('/', vehicleController.create);
router.get('/', vehicleController.getAll);
router.get('/:id', vehicleController.getById);
router.put('/:id', vehicleController.update);
router.delete('/:id', vehicleController.delete);
router.get('/:id/exists', vehicleController.exists);

module.exports = router;
