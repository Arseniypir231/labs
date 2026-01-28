import React, { useState, useEffect } from 'react';
import { vehiclesAPI } from '../services/api';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    vehicleType: '',
    sortBy: 'id',
    sortOrder: 'ASC'
  });

  const [formData, setFormData] = useState({
    licensePlate: '',
    brand: '',
    model: '',
    vehicleType: 'truck',
    capacity: '',
    status: 'available',
    year: ''
  });

  useEffect(() => {
    loadVehicles();
  }, [pagination.page, filters]);

  const loadVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      const response = await vehiclesAPI.getAll(params);
      setVehicles(response.data.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingVehicle) {
        await vehiclesAPI.update(editingVehicle.id, formData);
      } else {
        await vehiclesAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      loadVehicles();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при сохранении');
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      licensePlate: vehicle.licensePlate,
      brand: vehicle.brand,
      model: vehicle.model,
      vehicleType: vehicle.vehicleType,
      capacity: vehicle.capacity,
      status: vehicle.status,
      year: vehicle.year
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это транспортное средство?')) {
      try {
        await vehiclesAPI.delete(id);
        loadVehicles();
      } catch (err) {
        setError(err.response?.data?.error || 'Ошибка при удалении');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      licensePlate: '',
      brand: '',
      model: '',
      vehicleType: 'truck',
      capacity: '',
      status: 'available',
      year: ''
    });
    setEditingVehicle(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Транспортные средства</h2>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            Добавить транспортное средство
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="filters">
          <input
            type="text"
            placeholder="Поиск (номер, марка, модель)"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Все статусы</option>
            <option value="available">Доступно</option>
            <option value="in_use">В использовании</option>
            <option value="maintenance">На обслуживании</option>
            <option value="retired">Списано</option>
          </select>
          <select
            value={filters.vehicleType}
            onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
          >
            <option value="">Все типы</option>
            <option value="truck">Грузовик</option>
            <option value="van">Фургон</option>
            <option value="car">Автомобиль</option>
            <option value="motorcycle">Мотоцикл</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="id">Сортировать по ID</option>
            <option value="licensePlate">По номеру</option>
            <option value="brand">По марке</option>
            <option value="year">По году</option>
            <option value="capacity">По грузоподъемности</option>
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
                  <th>Номерной знак</th>
                  <th>Марка</th>
                  <th>Модель</th>
                  <th>Тип</th>
                  <th>Грузоподъемность</th>
                  <th>Год</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(vehicle => (
                  <tr key={vehicle.id}>
                    <td>{vehicle.id}</td>
                    <td>{vehicle.licensePlate}</td>
                    <td>{vehicle.brand}</td>
                    <td>{vehicle.model}</td>
                    <td>{vehicle.vehicleType}</td>
                    <td>{vehicle.capacity}</td>
                    <td>{vehicle.year}</td>
                    <td>{vehicle.status}</td>
                    <td>
                      <button className="btn btn-secondary" onClick={() => handleEdit(vehicle)} style={{ marginRight: '5px' }}>
                        Редактировать
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(vehicle.id)}>
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
            <h2>{editingVehicle ? 'Редактировать' : 'Добавить'} транспортное средство</h2>
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Номерной знак *</label>
              <input
                type="text"
                required
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Марка *</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Модель *</label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Тип *</label>
              <select
                required
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              >
                <option value="truck">Грузовик</option>
                <option value="van">Фургон</option>
                <option value="car">Автомобиль</option>
                <option value="motorcycle">Мотоцикл</option>
              </select>
            </div>
            <div className="form-group">
              <label>Грузоподъемность (тонн) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Год выпуска *</label>
              <input
                type="number"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Статус *</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="available">Доступно</option>
                <option value="in_use">В использовании</option>
                <option value="maintenance">На обслуживании</option>
                <option value="retired">Списано</option>
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

export default Vehicles;
