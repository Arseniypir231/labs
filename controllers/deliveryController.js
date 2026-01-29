const Delivery = require('../models/Delivery');

exports.createDelivery = async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    await delivery.save();
    await delivery.populate('driver vehicle');
    res.status(201).json({
      success: true,
      data: delivery
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
        message: 'Delivery with this number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getDeliveries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search,
      deliveryNumber,
      driver,
      vehicle,
      status,
      originCity,
      destinationCity,
      minWeight,
      maxWeight,
      minCost,
      maxCost,
      scheduledDateFrom,
      scheduledDateTo
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { deliveryNumber: { $regex: search, $options: 'i' } },
        { 'origin.address': { $regex: search, $options: 'i' } },
        { 'destination.address': { $regex: search, $options: 'i' } },
        { 'origin.city': { $regex: search, $options: 'i' } },
        { 'destination.city': { $regex: search, $options: 'i' } },
        { 'cargo.description': { $regex: search, $options: 'i' } }
      ];
    }

    if (deliveryNumber) query.deliveryNumber = { $regex: deliveryNumber, $options: 'i' };
    if (driver) query.driver = driver;
    if (vehicle) query.vehicle = vehicle;
    if (status) query.status = status;
    if (originCity) query['origin.city'] = { $regex: originCity, $options: 'i' };
    if (destinationCity) query['destination.city'] = { $regex: destinationCity, $options: 'i' };
    if (minWeight || maxWeight) {
      query['cargo.weight'] = {};
      if (minWeight) query['cargo.weight'].$gte = parseFloat(minWeight);
      if (maxWeight) query['cargo.weight'].$lte = parseFloat(maxWeight);
    }
    if (minCost || maxCost) {
      query.cost = {};
      if (minCost) query.cost.$gte = parseFloat(minCost);
      if (maxCost) query.cost.$lte = parseFloat(maxCost);
    }
    if (scheduledDateFrom || scheduledDateTo) {
      query.scheduledDate = {};
      if (scheduledDateFrom) query.scheduledDate.$gte = new Date(scheduledDateFrom);
      if (scheduledDateTo) query.scheduledDate.$lte = new Date(scheduledDateTo);
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortOrder };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const deliveries = await Delivery.find(query)
      .populate('driver vehicle')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Delivery.countDocuments(query);

    res.json({
      success: true,
      data: deliveries,
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

exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('driver vehicle');
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    res.json({
      success: true,
      data: delivery
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery ID'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('driver vehicle');

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    res.json({
      success: true,
      data: delivery
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery ID'
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
        message: 'Delivery with this number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    res.json({
      success: true,
      message: 'Delivery deleted successfully',
      data: delivery
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery ID'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.checkDeliveryExists = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    
    res.json({
      success: true,
      exists: !!delivery
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
      file: req.file ? req.file.filename : 'no file'
    });

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не загружен. Убедитесь, что вы выбрали файл изображения.'
      });
    }

    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    delivery.photoUrl = `/uploads/${req.file.filename}`;
    await delivery.save({ validateBeforeSave: false });

    console.log('Photo uploaded successfully:', delivery.photoUrl);

    res.json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('Ошибка загрузки фото:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Ошибка при загрузке фото'
    });
  }
};
