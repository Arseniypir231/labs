const Vehicle = require('./Vehicle');
const Route = require('./Route');
const Shipment = require('./Shipment');

// Определение связей между моделями
Shipment.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
Shipment.belongsTo(Route, { foreignKey: 'routeId', as: 'route' });

Vehicle.hasMany(Shipment, { foreignKey: 'vehicleId', as: 'shipments' });
Route.hasMany(Shipment, { foreignKey: 'routeId', as: 'shipments' });

module.exports = {
  Vehicle,
  Route,
  Shipment
};
