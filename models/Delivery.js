const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  deliveryNumber: {
    type: String,
    required: [true, 'Delivery number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: [true, 'Driver is required']
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle is required']
  },
  origin: {
    address: {
      type: String,
      required: [true, 'Origin address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Origin city is required'],
      trim: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  destination: {
    address: {
      type: String,
      required: [true, 'Destination address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Destination city is required'],
      trim: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  cargo: {
    description: {
      type: String,
      required: [true, 'Cargo description is required'],
      trim: true
    },
    weight: {
      type: Number,
      required: [true, 'Cargo weight is required'],
      min: [0, 'Weight cannot be negative']
    },
    weightUnit: {
      type: String,
      enum: ['kg', 'tons'],
      default: 'kg'
    },
    volume: Number,
    volumeUnit: {
      type: String,
      enum: ['cubic_meters', 'liters'],
      default: 'cubic_meters'
    }
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  actualStartDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v >= this.scheduledDate;
      },
      message: 'Actual start date cannot be before scheduled date'
    }
  },
  actualEndDate: {
    type: Date,
    validate: {
      validator: function(v) {
        if (!v) return true;
        if (this.actualStartDate && v < this.actualStartDate) {
          return false;
        }
        return true;
      },
      message: 'Actual end date cannot be before actual start date'
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_transit', 'delivered', 'cancelled', 'delayed'],
    default: 'scheduled'
  },
  distance: {
    type: Number,
    min: [0, 'Distance cannot be negative']
  },
  distanceUnit: {
    type: String,
    enum: ['km', 'miles'],
    default: 'km'
  },
  cost: {
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  currency: {
    type: String,
    default: 'RUB'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  photoUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

deliverySchema.index({ driver: 1 });
deliverySchema.index({ vehicle: 1 });
deliverySchema.index({ status: 1 });
deliverySchema.index({ scheduledDate: 1 });
deliverySchema.index({ 'origin.city': 1, 'destination.city': 1 });

deliverySchema.pre('save', async function(next) {
  if (!this.deliveryNumber) {
    const count = await mongoose.model('Delivery').countDocuments();
    this.deliveryNumber = `DLV-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Delivery', deliverySchema);
