const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  licensePlate: {
    type: String,
    required: [true, 'License plate is required'],
    unique: true,
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        return /^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/.test(v);
      },
      message: 'Invalid license plate format. Expected format: А123БВ777'
    }
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    minlength: [2, 'Brand must be at least 2 characters'],
    maxlength: [50, 'Brand cannot exceed 50 characters']
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true,
    minlength: [1, 'Model must be at least 1 character'],
    maxlength: [50, 'Model cannot exceed 50 characters']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be at least 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: {
      values: ['truck', 'van', 'car', 'trailer'],
      message: 'Vehicle type must be one of: truck, van, car, trailer'
    }
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [0, 'Capacity cannot be negative']
  },
  capacityUnit: {
    type: String,
    required: [true, 'Capacity unit is required'],
    enum: ['kg', 'tons', 'cubic_meters'],
    default: 'kg'
  },
  status: {
    type: String,
    enum: ['available', 'in_use', 'maintenance', 'out_of_service'],
    default: 'available'
  },
  mileage: {
    type: Number,
    default: 0,
    min: [0, 'Mileage cannot be negative']
  },
  lastMaintenanceDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v <= new Date();
      },
      message: 'Maintenance date cannot be in the future'
    }
  },
  photoUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

vehicleSchema.index({ brand: 1, model: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ vehicleType: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);
