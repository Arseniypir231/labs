const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Route = sequelize.define('Route', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Название маршрута не может быть пустым'
      },
      len: {
        args: [1, 100],
        msg: 'Название маршрута должно содержать от 1 до 100 символов'
      }
    }
  },
  origin: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Точка отправления не может быть пустой'
      }
    }
  },
  destination: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Точка назначения не может быть пустой'
      }
    }
  },
  distance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Расстояние должно быть числом'
      },
      min: {
        args: [0.01],
        msg: 'Расстояние должно быть больше 0'
      }
    }
  },
  estimatedTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Время в минутах',
    validate: {
      isInt: {
        msg: 'Оценочное время должно быть целым числом'
      },
      min: {
        args: [1],
        msg: 'Оценочное время должно быть больше 0'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'archived'),
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: {
        args: [['active', 'inactive', 'archived']],
        msg: 'Статус должен быть: active, inactive или archived'
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
  waypoints: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  vehicleTypes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  restrictions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tollCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      isDecimal: {
        msg: 'Стоимость платных дорог должна быть числом'
      },
      min: {
        args: [0],
        msg: 'Стоимость не может быть отрицательной'
      }
    }
  },
  fuelCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      isDecimal: {
        msg: 'Расходы на топливо должны быть числом'
      },
      min: {
        args: [0],
        msg: 'Расходы не могут быть отрицательными'
      }
    }
  }
}, {
  tableName: 'routes',
  timestamps: true,
  underscored: true
});

module.exports = Route;
