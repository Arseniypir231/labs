const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const upload = require('../config/upload');

router.post('/', driverController.createDriver);

router.get('/', driverController.getDrivers);

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
}, driverController.uploadPhoto);

router.get('/:id/exists', driverController.checkDriverExists);

router.get('/:id', driverController.getDriverById);

router.put('/:id', driverController.updateDriver);

router.delete('/:id', driverController.deleteDriver);

module.exports = router;
