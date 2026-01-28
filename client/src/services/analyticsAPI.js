import api from './api';

export const analyticsAPI = {
  getShipmentsByMonth: (params) => api.get('/analytics/shipments-by-month', { params }),
  getShipmentsByStatus: () => api.get('/analytics/shipments-by-status'),
  getTopRoutes: (limit = 10) => api.get('/analytics/top-routes', { params: { limit } }),
  getVehiclesByType: () => api.get('/analytics/vehicles-by-type'),
  getDashboardStats: () => api.get('/analytics/dashboard-stats')
};
