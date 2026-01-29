const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const upload = require('../config/upload');

router.post('/', deliveryController.createDelivery);

router.get('/', deliveryController.getDeliveries);

router.post('/:id/photo', (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({
        success: false,
        message: err.message || 'Ошибка при загрузке файла'
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не получен. Проверьте, что поле формы называется "photo"'
      });
    }
    next();
  });
}, deliveryController.uploadPhoto);

router.get('/:id/exists', deliveryController.checkDeliveryExists);

router.get('/:id', deliveryController.getDeliveryById);

router.put('/:id', deliveryController.updateDelivery);

router.delete('/:id', deliveryController.deleteDelivery);

module.exports = router;
