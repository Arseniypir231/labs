const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const upload = require('../config/upload');

router.post('/', vehicleController.createVehicle);

router.get('/', vehicleController.getVehicles);

router.post('/:id/photo', 
  (req, res, next) => {
    console.log('=== Photo upload route hit ===');
    console.log('ID:', req.params.id);
    console.log('Content-Type:', req.headers['content-type']);
    
    upload.single('photo')(req, res, (err) => {
      if (err) {
        console.error('❌ Multer error:', err.message);
        console.error('❌ Multer error code:', err.code);
        console.error('❌ Multer error stack:', err.stack);
        return res.status(400).json({
          success: false,
          message: err.message || 'Ошибка при загрузке файла'
        });
      }
      
      console.log('✅ Multer processed successfully');
      console.log('File:', req.file ? {
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: req.file.path
      } : 'NO FILE');
      
      if (!req.file) {
        console.error('❌ No file received');
        return res.status(400).json({
          success: false,
          message: 'Файл не получен. Проверьте, что поле формы называется "photo"'
        });
      }
      next();
    });
  },
  vehicleController.uploadPhoto
);

router.get('/:id/exists', vehicleController.checkVehicleExists);

router.get('/:id', vehicleController.getVehicleById);

router.put('/:id', vehicleController.updateVehicle);

router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;
