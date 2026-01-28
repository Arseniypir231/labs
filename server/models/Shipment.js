const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shipment = sequelize.define('Shipment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vehicles',
      key: 'id'
    },
    validate: {
      isInt: {
        msg: 'ID транспортного средства должен быть целым числом'
      }
    }
  },
  routeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'routes',
      key: 'id'
    },
    validate: {
      isInt: {
        msg: 'ID маршрута должен быть целым числом'
      }
    }
  },
  cargoDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Описание груза не может быть пустым'
      }
    }
  },
  weight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Вес должен быть числом'
      },
      min: {
        args: [0.01],
        msg: 'Вес должен быть больше 0'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_transit', 'delivered', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: {
        args: [['pending', 'in_transit', 'delivered', 'cancelled']],
        msg: 'Статус должен быть: pending, in_transit, delivered или cancelled'
      }
    }
  },
  departureDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Дата отправления должна быть валидной датой'
      },
      isAfter: {
        args: ['1900-01-01'],
        msg: 'Дата отправления не может быть раньше 1900 года'
      }
    }
  },
  deliveryDate: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Дата доставки должна быть валидной датой'
      },
      customValidator(value) {
        if (value && this.departureDate && value < this.departureDate) {
          throw new Error('Дата доставки не может быть раньше даты отправления');
        }
      }
    }
  },
  photoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'URL фотографии должен быть валидным URL'
      }
    }
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'Порядок отображения для сортировки'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: true,
    defaultValue: 'medium',
    validate: {
      isIn: {
        args: [['low', 'medium', 'high']],
        msg: 'Приоритет должен быть: low, medium или high'
      }
    }
  },
  insuranceValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      isDecimal: {
        msg: 'Страховая стоимость должна быть числом'
      },
      min: {
        args: [0],
        msg: 'Страховая стоимость не может быть отрицательной'
      }
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'shipments',
  timestamps: true,
  underscored: true
});

module.exports = Shipment;
