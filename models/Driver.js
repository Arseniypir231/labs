const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^(\+7|8)\d{10}$/.test(v.replace(/[\s\-\(\)]/g, ''));
      },
      message: 'Invalid phone number format. Expected: +7XXXXXXXXXX or 8XXXXXXXXXX'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        return /^\d{2}[АВЕКМНОРСТУХ]{2}\d{6}$/.test(v);
      },
      message: 'Invalid license number format'
    }
  },
  licenseCategory: {
    type: [String],
    required: [true, 'License category is required'],
    validate: {
      validator: function(v) {
        const validCategories = ['B', 'C', 'CE', 'D', 'DE'];
        return v.length > 0 && v.every(cat => validCategories.includes(cat));
      },
      message: 'License category must be one or more of: B, C, CE, D, DE'
    }
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience seems unrealistic']
  },
  status: {
    type: String,
    enum: ['available', 'on_delivery', 'sick_leave', 'vacation'],
    default: 'available'
  },
  hireDate: {
    type: Date,
    required: [true, 'Hire date is required'],
    validate: {
      validator: function(v) {
        return v <= new Date();
      },
      message: 'Hire date cannot be in the future'
    }
  },
  address: {
    street: String,
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    zipCode: String
  },
  photoUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

driverSchema.index({ status: 1 });
driverSchema.index({ lastName: 1, firstName: 1 });

driverSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Driver', driverSchema);
