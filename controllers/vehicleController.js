const Vehicle = require('../models/Vehicle');

exports.createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle with this license plate already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search,
      brand,
      model,
      vehicleType,
      status,
      year,
      minCapacity,
      maxCapacity
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { licensePlate: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } }
      ];
    }

    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (model) query.model = { $regex: model, $options: 'i' };
    if (vehicleType) query.vehicleType = vehicleType;
    if (status) query.status = status;
    if (year) query.year = parseInt(year);
    if (minCapacity || maxCapacity) {
      query.capacity = {};
      if (minCapacity) query.capacity.$gte = parseFloat(minCapacity);
      if (maxCapacity) query.capacity.$lte = parseFloat(maxCapacity);
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortOrder };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const vehicles = await Vehicle.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Vehicle.countDocuments(query);

    res.json({
      success: true,
      data: vehicles,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle ID'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle ID'
      });
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle with this license plate already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      message: 'Vehicle deleted successfully',
      data: vehicle
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle ID'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.checkVehicleExists = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    
    res.json({
      success: true,
      exists: !!vehicle
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.json({
        success: true,
        exists: false
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    console.log('Upload photo request:', {
      id: req.params.id,
      file: req.file ? req.file.filename : 'no file',
      body: req.body
    });

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не загружен. Убедитесь, что вы выбрали файл изображения.'
      });
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    vehicle.photoUrl = `/uploads/${req.file.filename}`;
    await vehicle.save({ validateBeforeSave: false });

    console.log('Photo uploaded successfully:', vehicle.photoUrl);

    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    console.error('Ошибка загрузки фото:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Ошибка при загрузке фото',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
