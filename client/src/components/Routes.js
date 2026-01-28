import React, { useState, useEffect } from 'react';
import { routesAPI } from '../services/api';

function Routes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'id',
    sortOrder: 'ASC'
  });

  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    destination: '',
    distance: '',
    estimatedTime: '',
    status: 'active'
  });

  useEffect(() => {
    loadRoutes();
  }, [pagination.page, filters]);

  const loadRoutes = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      const response = await routesAPI.getAll(params);
      setRoutes(response.data.data);
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
      if (editingRoute) {
        await routesAPI.update(editingRoute.id, formData);
      } else {
        await routesAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      loadRoutes();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при сохранении');
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      origin: route.origin,
      destination: route.destination,
      distance: route.distance,
      estimatedTime: route.estimatedTime,
      status: route.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот маршрут?')) {
      try {
        await routesAPI.delete(id);
        loadRoutes();
      } catch (err) {
        setError(err.response?.data?.error || 'Ошибка при удалении');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      origin: '',
      destination: '',
      distance: '',
      estimatedTime: '',
      status: 'active'
    });
    setEditingRoute(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Маршруты</h2>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            Добавить маршрут
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="filters">
          <input
            type="text"
            placeholder="Поиск (название, отправление, назначение)"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Все статусы</option>
            <option value="active">Активный</option>
            <option value="inactive">Неактивный</option>
            <option value="archived">Архивирован</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="id">Сортировать по ID</option>
            <option value="name">По названию</option>
            <option value="distance">По расстоянию</option>
            <option value="estimatedTime">По времени</option>
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
                  <th>Название</th>
                  <th>Отправление</th>
                  <th>Назначение</th>
                  <th>Расстояние (км)</th>
                  <th>Время (мин)</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {routes.map(route => (
                  <tr key={route.id}>
                    <td>{route.id}</td>
                    <td>{route.name}</td>
                    <td>{route.origin}</td>
                    <td>{route.destination}</td>
                    <td>{route.distance}</td>
                    <td>{route.estimatedTime}</td>
                    <td>{route.status}</td>
                    <td>
                      <button className="btn btn-secondary" onClick={() => handleEdit(route)} style={{ marginRight: '5px' }}>
                        Редактировать
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(route.id)}>
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
            <h2>{editingRoute ? 'Редактировать' : 'Добавить'} маршрут</h2>
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Название *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Точка отправления *</label>
              <input
                type="text"
                required
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Точка назначения *</label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Расстояние (км) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Оценочное время (минуты) *</label>
              <input
                type="number"
                required
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Статус *</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Активный</option>
                <option value="inactive">Неактивный</option>
                <option value="archived">Архивирован</option>
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

export default Routes;
