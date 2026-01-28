const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  licensePlate: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Номерной знак не может быть пустым'
      },
      len: {
        args: [2, 20],
        msg: 'Номерной знак должен содержать от 2 до 20 символов'
      }
    }
  },
  brand: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Марка транспортного средства не может быть пустой'
      },
      len: {
        args: [1, 50],
        msg: 'Марка должна содержать от 1 до 50 символов'
      }
    }
  },
  model: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Модель транспортного средства не может быть пустой'
      }
    }
  },
  vehicleType: {
    type: DataTypes.ENUM('truck', 'van', 'car', 'motorcycle'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['truck', 'van', 'car', 'motorcycle']],
        msg: 'Тип транспортного средства должен быть: truck, van, car или motorcycle'
      }
    }
  },
  capacity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Грузоподъемность должна быть числом'
      },
      min: {
        args: [0.01],
        msg: 'Грузоподъемность должна быть больше 0'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('available', 'in_use', 'maintenance', 'retired'),
    allowNull: false,
    defaultValue: 'available',
    validate: {
      isIn: {
        args: [['available', 'in_use', 'maintenance', 'retired']],
        msg: 'Статус должен быть: available, in_use, maintenance или retired'
      }
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'Год выпуска должен быть целым числом'
      },
      min: {
        args: [1900],
        msg: 'Год выпуска не может быть раньше 1900'
      },
      max: {
        args: [new Date().getFullYear() + 1],
        msg: 'Год выпуска не может быть в будущем'
      }
    }
  }
}, {
  tableName: 'vehicles',
  timestamps: true,
  underscored: true
});

module.exports = Vehicle;
