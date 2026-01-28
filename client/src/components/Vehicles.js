import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {
  fetchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  setFilters,
  setPagination,
  clearError
} from '../store/slices/vehiclesSlice';
import { validateVehicle } from '../utils/validation';

function Vehicles() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error, pagination, filters } = useSelector(state => state.vehicles);
  
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  const [formData, setFormData] = useState({
    licensePlate: '',
    brand: '',
    model: '',
    vehicleType: 'truck',
    capacity: '',
    status: 'available',
    year: '',
    photoUrl: ''
  });

  useEffect(() => {
    loadVehicles();
  }, [pagination.page, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loadVehicles = () => {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...filters
    };
    dispatch(fetchVehicles(params));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateVehicle(formData);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error('Пожалуйста, исправьте ошибки в форме');
      return;
    }

    try {
      if (editingVehicle) {
        await dispatch(updateVehicle({ id: editingVehicle.id, data: formData })).unwrap();
        toast.success('Транспортное средство успешно обновлено');
      } else {
        await dispatch(createVehicle(formData)).unwrap();
        toast.success('Транспортное средство успешно создано');
      }
      setShowModal(false);
      resetForm();
      loadVehicles();
    } catch (err) {
      toast.error(err || 'Ошибка при сохранении');
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
      year: vehicle.year,
      photoUrl: vehicle.photoUrl || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это транспортное средство?')) {
      try {
        await dispatch(deleteVehicle(id)).unwrap();
        toast.success('Транспортное средство успешно удалено');
        loadVehicles();
      } catch (err) {
        toast.error(err || 'Ошибка при удалении. Возможно, транспортное средство используется в грузоперевозках.');
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
      year: '',
      photoUrl: ''
    });
    setEditingVehicle(null);
    setFormErrors({});
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
    dispatch(setPagination({ page: 1 }));
  };

  const handleViewDetails = (id) => {
    navigate(`/vehicles/${id}`);
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card">
        <div className="card-header">
          <h2>Транспортные средства</h2>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            Добавить транспортное средство
          </button>
        </div>

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
            <div className="table">
              <table>
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
                  {items.map(vehicle => (
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
                        <button className="btn btn-success" onClick={() => handleViewDetails(vehicle.id)} style={{ marginRight: '5px', marginBottom: '5px' }}>
                          Подробнее
                        </button>
                        <button className="btn btn-secondary" onClick={() => handleEdit(vehicle)} style={{ marginRight: '5px', marginBottom: '5px' }}>
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
            <h2>{editingVehicle ? 'Редактировать' : 'Добавить'} транспортное средство</h2>
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Номерной знак *</label>
              <input
                type="text"
                className={formErrors.licensePlate ? 'error' : ''}
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
              />
              {formErrors.licensePlate && <div className="form-error">{formErrors.licensePlate}</div>}
            </div>
            <div className="form-group">
              <label>Марка *</label>
              <input
                type="text"
                className={formErrors.brand ? 'error' : ''}
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
              {formErrors.brand && <div className="form-error">{formErrors.brand}</div>}
            </div>
            <div className="form-group">
              <label>Модель *</label>
              <input
                type="text"
                className={formErrors.model ? 'error' : ''}
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
              {formErrors.model && <div className="form-error">{formErrors.model}</div>}
            </div>
            <div className="form-group">
              <label>Тип *</label>
              <select
                className={formErrors.vehicleType ? 'error' : ''}
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
                className={formErrors.capacity ? 'error' : ''}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
              {formErrors.capacity && <div className="form-error">{formErrors.capacity}</div>}
            </div>
            <div className="form-group">
              <label>Год выпуска *</label>
              <input
                type="number"
                className={formErrors.year ? 'error' : ''}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
              {formErrors.year && <div className="form-error">{formErrors.year}</div>}
            </div>
            <div className="form-group">
              <label>Статус *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="available">Доступно</option>
                <option value="in_use">В использовании</option>
                <option value="maintenance">На обслуживании</option>
                <option value="retired">Списано</option>
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

export default Vehicles;
