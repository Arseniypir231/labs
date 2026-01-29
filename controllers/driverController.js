const Driver = require('../models/Driver');

exports.createDriver = async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json({
      success: true,
      data: driver
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
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Driver with this ${field} already exists`
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getDrivers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search,
      firstName,
      lastName,
      status,
      licenseCategory,
      minExperience,
      maxExperience,
      city
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (firstName) query.firstName = { $regex: firstName, $options: 'i' };
    if (lastName) query.lastName = { $regex: lastName, $options: 'i' };
    if (status) query.status = status;
    if (licenseCategory) {
      query.licenseCategory = { $in: Array.isArray(licenseCategory) ? licenseCategory : [licenseCategory] };
    }
    if (minExperience || maxExperience) {
      query.experience = {};
      if (minExperience) query.experience.$gte = parseInt(minExperience);
      if (maxExperience) query.experience.$lte = parseInt(maxExperience);
    }
    if (city) query['address.city'] = { $regex: city, $options: 'i' };

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortOrder };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const drivers = await Driver.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Driver.countDocuments(query);

    res.json({
      success: true,
      data: drivers,
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

exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      data: driver
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid driver ID'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      data: driver
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid driver ID'
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
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Driver with this ${field} already exists`
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      message: 'Driver deleted successfully',
      data: driver
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid driver ID'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.checkDriverExists = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    
    res.json({
      success: true,
      exists: !!driver
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

    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    driver.photoUrl = `/uploads/${req.file.filename}`;
    await driver.save({ validateBeforeSave: false });

    console.log('Photo uploaded successfully:', driver.photoUrl);

    res.json({
      success: true,
      data: driver
    });
  } catch (error) {
    console.error('Ошибка загрузки фото:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Ошибка при загрузке фото'
    });
  }
};
