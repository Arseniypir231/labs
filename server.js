const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const app = express();

app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

connectDB();

app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/deliveries', require('./routes/deliveries'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Transport Logistics API is running' });
});

app.use((err, req, res, next) => {
  console.error('Error middleware:', err.message);
  console.error('Error stack:', err.stack);
  
  if (err instanceof require('multer').MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Файл слишком большой. Максимальный размер: 5MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || 'Ошибка при загрузке файла'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
