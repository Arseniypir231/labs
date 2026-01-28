import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {
  fetchRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
  setFilters,
  setPagination,
  clearError
} from '../store/slices/routesSlice';
import { validateRoute } from '../utils/validation';

function Routes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error, pagination, filters } = useSelector(state => state.routes);
  const { user } = useSelector(state => state.auth);
  const canEdit = user?.role === 'admin' || user?.role === 'manager';
  
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    destination: '',
    distance: '',
    estimatedTime: '',
    status: 'active',
    photoUrl: ''
  });

  useEffect(() => {
    loadRoutes();
  }, [pagination.page, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loadRoutes = () => {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...filters
    };
    dispatch(fetchRoutes(params));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateRoute(formData);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error('Пожалуйста, исправьте ошибки в форме');
      return;
    }

    try {
      if (editingRoute) {
        await dispatch(updateRoute({ id: editingRoute.id, data: formData })).unwrap();
        toast.success('Маршрут успешно обновлен');
      } else {
        await dispatch(createRoute(formData)).unwrap();
        toast.success('Маршрут успешно создан');
      }
      setShowModal(false);
      resetForm();
      loadRoutes();
    } catch (err) {
      toast.error(err || 'Ошибка при сохранении');
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
      status: route.status,
      photoUrl: route.photoUrl || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот маршрут?')) {
      try {
        await dispatch(deleteRoute(id)).unwrap();
        toast.success('Маршрут успешно удален');
        loadRoutes();
      } catch (err) {
        toast.error(err || 'Ошибка при удалении. Возможно, маршрут используется в грузоперевозках.');
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
      status: 'active',
      photoUrl: ''
    });
    setEditingRoute(null);
    setFormErrors({});
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
    dispatch(setPagination({ page: 1 }));
  };

  const handleViewDetails = (id) => {
    navigate(`/routes/${id}`);
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card">
        <div className="card-header">
          <h2>Маршруты</h2>
          {canEdit && (
            <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
              Добавить маршрут
            </button>
          )}
        </div>

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
            <div className="table">
              <table>
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
                  {items.map(route => (
                    <tr key={route.id}>
                      <td>{route.id}</td>
                      <td>{route.name}</td>
                      <td>{route.origin}</td>
                      <td>{route.destination}</td>
                      <td>{route.distance}</td>
                      <td>{route.estimatedTime}</td>
                      <td>{route.status}</td>
                      <td>
                        <button className="btn btn-success" onClick={() => handleViewDetails(route.id)} style={{ marginRight: '5px', marginBottom: '5px' }}>
                          Подробнее
                        </button>
                        {canEdit && (
                          <>
                            <button className="btn btn-secondary" onClick={() => handleEdit(route)} style={{ marginRight: '5px', marginBottom: '5px' }}>
                              Редактировать
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(route.id)}>
                              Удалить
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                onClick={() => dispatch(setPagination({ page: pagination.page - 1 }))}
                disabled={pagination.page === 1}
              >
                Назад
              </button>
              <span>Страница {pagination.page} из {pagination.totalPages}</span>
              <button
                onClick={() => dispatch(setPagination({ page: pagination.page + 1 }))}
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
                className={formErrors.name ? 'error' : ''}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {formErrors.name && <div className="form-error">{formErrors.name}</div>}
            </div>
            <div className="form-group">
              <label>Точка отправления *</label>
              <input
                type="text"
                className={formErrors.origin ? 'error' : ''}
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              />
              {formErrors.origin && <div className="form-error">{formErrors.origin}</div>}
            </div>
            <div className="form-group">
              <label>Точка назначения *</label>
              <input
                type="text"
                className={formErrors.destination ? 'error' : ''}
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
              {formErrors.destination && <div className="form-error">{formErrors.destination}</div>}
            </div>
            <div className="form-group">
              <label>Расстояние (км) *</label>
              <input
                type="number"
                step="0.01"
                className={formErrors.distance ? 'error' : ''}
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
              />
              {formErrors.distance && <div className="form-error">{formErrors.distance}</div>}
            </div>
            <div className="form-group">
              <label>Оценочное время (минуты) *</label>
              <input
                type="number"
                className={formErrors.estimatedTime ? 'error' : ''}
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
              />
              {formErrors.estimatedTime && <div className="form-error">{formErrors.estimatedTime}</div>}
            </div>
            <div className="form-group">
              <label>Статус *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Активный</option>
                <option value="inactive">Неактивный</option>
                <option value="archived">Архивирован</option>
              </select>
            </div>
            <div className="form-group">
              <label>URL фотографии</label>
              <input
                type="url"
                className={formErrors.photoUrl ? 'error' : ''}
                placeholder="https://example.com/photo.jpg"
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
              />
              {formErrors.photoUrl && <div className="form-error">{formErrors.photoUrl}</div>}
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
