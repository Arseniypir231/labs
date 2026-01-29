import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const vehiclesAPI = {
  getAll: (params) => api.get('/vehicles', { params }),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
  checkExists: (id) => api.get(`/vehicles/${id}/exists`),
  uploadPhoto: (id, file) => {
    const formData = new FormData();
    formData.append('photo', file);
    return api.post(`/vehicles/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getPhotoUrl: (photoUrl) => {
    if (!photoUrl) return null;
    return photoUrl.startsWith('http') ? photoUrl : `${API_BASE_URL.replace('/api', '')}${photoUrl}`;
  },
};

export const driversAPI = {
  getAll: (params) => api.get('/drivers', { params }),
  getById: (id) => api.get(`/drivers/${id}`),
  create: (data) => api.post('/drivers', data),
  update: (id, data) => api.put(`/drivers/${id}`, data),
  delete: (id) => api.delete(`/drivers/${id}`),
  checkExists: (id) => api.get(`/drivers/${id}/exists`),
  uploadPhoto: (id, file) => {
    const formData = new FormData();
    formData.append('photo', file);
    return api.post(`/drivers/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getPhotoUrl: (photoUrl) => {
    if (!photoUrl) return null;
    return photoUrl.startsWith('http') ? photoUrl : `${API_BASE_URL.replace('/api', '')}${photoUrl}`;
  },
};

export const deliveriesAPI = {
  getAll: (params) => api.get('/deliveries', { params }),
  getById: (id) => api.get(`/deliveries/${id}`),
  create: (data) => api.post('/deliveries', data),
  update: (id, data) => api.put(`/deliveries/${id}`, data),
  delete: (id) => api.delete(`/deliveries/${id}`),
  checkExists: (id) => api.get(`/deliveries/${id}/exists`),
  uploadPhoto: (id, file) => {
    const formData = new FormData();
    formData.append('photo', file);
    return api.post(`/deliveries/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getPhotoUrl: (photoUrl) => {
    if (!photoUrl) return null;
    return photoUrl.startsWith('http') ? photoUrl : `${API_BASE_URL.replace('/api', '')}${photoUrl}`;
  },
};

export default api;
