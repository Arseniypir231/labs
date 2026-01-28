import React, { useState, useEffect } from 'react';
import { shipmentsAPI, vehiclesAPI, routesAPI } from '../services/api';

function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingShipment, setEditingShipment] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'id',
    sortOrder: 'ASC'
  });

  const [formData, setFormData] = useState({
    vehicleId: '',
    routeId: '',
    cargoDescription: '',
    weight: '',
    status: 'pending',
    departureDate: '',
    deliveryDate: ''
  });

  useEffect(() => {
    loadShipments();
    loadVehicles();
    loadRoutes();
  }, [pagination.page, filters]);

  const loadShipments = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      const response = await shipmentsAPI.getAll(params);
      setShipments(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async () => {
    try {
      const response = await vehiclesAPI.getAll({ limit: 1000 });
      setVehicles(response.data.data);
    } catch (err) {
      console.error('Ошибка при загрузке транспортных средств:', err);
    }
  };

  const loadRoutes = async () => {
    try {
      const response = await routesAPI.getAll({ limit: 1000 });
      setRoutes(response.data.data);
    } catch (err) {
      console.error('Ошибка при загрузке маршрутов:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = {
        ...formData,
        vehicleId: parseInt(formData.vehicleId),
        routeId: parseInt(formData.routeId),
        weight: parseFloat(formData.weight)
      };
      if (editingShipment) {
        await shipmentsAPI.update(editingShipment.id, data);
      } else {
        await shipmentsAPI.create(data);
      }
      setShowModal(false);
      resetForm();
      loadShipments();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при сохранении');
    }
  };

  const handleEdit = (shipment) => {
    setEditingShipment(shipment);
    setFormData({
      vehicleId: shipment.vehicleId,
      routeId: shipment.routeId,
      cargoDescription: shipment.cargoDescription,
      weight: shipment.weight,
      status: shipment.status,
      departureDate: shipment.departureDate ? shipment.departureDate.split('T')[0] : '',
      deliveryDate: shipment.deliveryDate ? shipment.deliveryDate.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту грузоперевозку?')) {
      try {
        await shipmentsAPI.delete(id);
        loadShipments();
      } catch (err) {
        setError(err.response?.data?.error || 'Ошибка при удалении');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleId: '',
      routeId: '',
      cargoDescription: '',
      weight: '',
      status: 'pending',
      departureDate: '',
      deliveryDate: ''
    });
    setEditingShipment(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Грузоперевозки</h2>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            Добавить грузоперевозку
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="filters">
          <input
            type="text"
            placeholder="Поиск (описание груза)"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Все статусы</option>
            <option value="pending">Ожидает</option>
            <option value="in_transit">В пути</option>
            <option value="delivered">Доставлено</option>
            <option value="cancelled">Отменено</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="id">Сортировать по ID</option>
            <option value="departureDate">По дате отправления</option>
            <option value="weight">По весу</option>
            <option value="status">По статусу</option>
          </select>
          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
          >
            <option value="ASC">По возрастанию</option>
            <option value="DESC">По убыванию</option>
          </select>
        </div>

        {loading ? (
          <div>Загрузка...</div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Транспорт</th>
                  <th>Маршрут</th>
                  <th>Описание груза</th>
                  <th>Вес (т)</th>
                  <th>Дата отправления</th>
                  <th>Дата доставки</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map(shipment => (
                  <tr key={shipment.id}>
                    <td>{shipment.id}</td>
                    <td>{shipment.vehicle ? `${shipment.vehicle.brand} ${shipment.vehicle.model} (${shipment.vehicle.licensePlate})` : 'N/A'}</td>
                    <td>{shipment.route ? `${shipment.route.origin} → ${shipment.route.destination}` : 'N/A'}</td>
                    <td>{shipment.cargoDescription}</td>
                    <td>{shipment.weight}</td>
                    <td>{shipment.departureDate ? new Date(shipment.departureDate).toLocaleDateString('ru-RU') : 'N/A'}</td>
                    <td>{shipment.deliveryDate ? new Date(shipment.deliveryDate).toLocaleDateString('ru-RU') : 'N/A'}</td>
                    <td>{shipment.status}</td>
                    <td>
                      <button className="btn btn-secondary" onClick={() => handleEdit(shipment)} style={{ marginRight: '5px' }}>
                        Редактировать
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(shipment.id)}>
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                Назад
              </button>
              <span>Страница {pagination.page} из {pagination.totalPages}</span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Вперед
              </button>
            </div>
          </>
        )}
      </div>

      <div className={`modal ${showModal ? 'show' : ''}`} onClick={() => setShowModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{editingShipment ? 'Редактировать' : 'Добавить'} грузоперевозку</h2>
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Транспортное средство *</label>
              <select
                required
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              >
                <option value="">Выберите транспортное средство</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Маршрут *</label>
              <select
                required
                value={formData.routeId}
                onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
              >
                <option value="">Выберите маршрут</option>
                {routes.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.name}: {route.origin} → {route.destination}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Описание груза *</label>
              <textarea
                required
                value={formData.cargoDescription}
                onChange={(e) => setFormData({ ...formData, cargoDescription: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Вес (тонн) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Дата отправления *</label>
              <input
                type="date"
                required
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Дата доставки</label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Статус *</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Ожидает</option>
                <option value="in_transit">В пути</option>
                <option value="delivered">Доставлено</option>
                <option value="cancelled">Отменено</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Сохранить</button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ marginLeft: '10px' }}>
              Отмена
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Shipments;
