import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {
  fetchShipments,
  createShipment,
  updateShipment,
  deleteShipment,
  setFilters,
  setPagination,
  clearError
} from '../store/slices/shipmentsSlice';
import { fetchVehicles } from '../store/slices/vehiclesSlice';
import { fetchRoutes } from '../store/slices/routesSlice';
import { validateShipment } from '../utils/validation';
import { exportShipmentsReport } from '../utils/exportUtils';

function Shipments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error, pagination, filters } = useSelector(state => state.shipments);
  const { items: vehicles } = useSelector(state => state.vehicles);
  const { items: routes } = useSelector(state => state.routes);
  const { user, token } = useSelector(state => state.auth);
  const canEdit = user?.role === 'admin' || user?.role === 'manager';
  
  const [showModal, setShowModal] = useState(false);
  const [editingShipment, setEditingShipment] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [exporting, setExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPeriod, setExportPeriod] = useState({
    startDate: '',
    endDate: ''
  });
  
  const [formData, setFormData] = useState({
    vehicleId: '',
    routeId: '',
    cargoDescription: '',
    weight: '',
    status: 'pending',
    departureDate: '',
    deliveryDate: '',
    photoUrl: ''
  });

  useEffect(() => {
    loadShipments();
    if (vehicles.length === 0) {
      dispatch(fetchVehicles({ limit: 1000 }));
    }
    if (routes.length === 0) {
      dispatch(fetchRoutes({ limit: 1000 }));
    }
  }, [pagination.page, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loadShipments = () => {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...filters
    };
    dispatch(fetchShipments(params));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateShipment(formData);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error('Пожалуйста, исправьте ошибки в форме');
      return;
    }

    try {
      const data = {
        ...formData,
        vehicleId: parseInt(formData.vehicleId),
        routeId: parseInt(formData.routeId),
        weight: parseFloat(formData.weight)
      };
      if (editingShipment) {
        await dispatch(updateShipment({ id: editingShipment.id, data })).unwrap();
        toast.success('Грузоперевозка успешно обновлена');
      } else {
        await dispatch(createShipment(data)).unwrap();
        toast.success('Грузоперевозка успешно создана');
      }
      setShowModal(false);
      resetForm();
      loadShipments();
    } catch (err) {
      toast.error(err || 'Ошибка при сохранении');
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
      deliveryDate: shipment.deliveryDate ? shipment.deliveryDate.split('T')[0] : '',
      photoUrl: shipment.photoUrl || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту грузоперевозку?')) {
      try {
        await dispatch(deleteShipment(id)).unwrap();
        toast.success('Грузоперевозка успешно удалена');
        loadShipments();
      } catch (err) {
        toast.error(err || 'Ошибка при удалении');
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
      deliveryDate: '',
      photoUrl: ''
    });
    setEditingShipment(null);
    setFormErrors({});
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
    dispatch(setPagination({ page: 1 }));
  };

  const handleViewDetails = (id) => {
    navigate(`/shipments/${id}`);
  };

  const handleExport = async (format) => {
    if (!token) {
      toast.error('Необходима авторизация для экспорта');
      return;
    }

    setExporting(true);
    try {
      await exportShipmentsReport(format, exportPeriod.startDate, exportPeriod.endDate, token);
      toast.success(`Отчет успешно экспортирован в формате ${format.toUpperCase()}`);
      setShowExportModal(false);
      setExportPeriod({ startDate: '', endDate: '' });
    } catch (err) {
      toast.error('Ошибка при экспорте отчета');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card">
        <div className="card-header">
          <h2>Грузоперевозки</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-success" 
              onClick={() => setShowExportModal(true)}
              disabled={exporting}
              title="Экспорт отчета"
            >
              {exporting ? 'Экспорт...' : '📊 Экспорт отчета'}
            </button>
            {canEdit && (
              <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                Добавить грузоперевозку
              </button>
            )}
          </div>
        </div>

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
            <div className="table">
              <table>
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
                  {items.map(shipment => (
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
                        <button className="btn btn-success" onClick={() => handleViewDetails(shipment.id)} style={{ marginRight: '5px', marginBottom: '5px' }}>
                          Подробнее
                        </button>
                        {canEdit && (
                          <>
                            <button className="btn btn-secondary" onClick={() => handleEdit(shipment)} style={{ marginRight: '5px', marginBottom: '5px' }}>
                              Редактировать
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(shipment.id)}>
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
            <h2>{editingShipment ? 'Редактировать' : 'Добавить'} грузоперевозку</h2>
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Транспортное средство *</label>
              <select
                className={formErrors.vehicleId ? 'error' : ''}
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
              {formErrors.vehicleId && <div className="form-error">{formErrors.vehicleId}</div>}
            </div>
            <div className="form-group">
              <label>Маршрут *</label>
              <select
                className={formErrors.routeId ? 'error' : ''}
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
              {formErrors.routeId && <div className="form-error">{formErrors.routeId}</div>}
            </div>
            <div className="form-group">
              <label>Описание груза *</label>
              <textarea
                className={formErrors.cargoDescription ? 'error' : ''}
                value={formData.cargoDescription}
                onChange={(e) => setFormData({ ...formData, cargoDescription: e.target.value })}
              />
              {formErrors.cargoDescription && <div className="form-error">{formErrors.cargoDescription}</div>}
            </div>
            <div className="form-group">
              <label>Вес (тонн) *</label>
              <input
                type="number"
                step="0.01"
                className={formErrors.weight ? 'error' : ''}
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
              {formErrors.weight && <div className="form-error">{formErrors.weight}</div>}
            </div>
            <div className="form-group">
              <label>Дата отправления *</label>
              <input
                type="date"
                className={formErrors.departureDate ? 'error' : ''}
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
              />
              {formErrors.departureDate && <div className="form-error">{formErrors.departureDate}</div>}
            </div>
            <div className="form-group">
              <label>Дата доставки</label>
              <input
                type="date"
                className={formErrors.deliveryDate ? 'error' : ''}
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              />
              {formErrors.deliveryDate && <div className="form-error">{formErrors.deliveryDate}</div>}
            </div>
            <div className="form-group">
              <label>Статус *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Ожидает</option>
                <option value="in_transit">В пути</option>
                <option value="delivered">Доставлено</option>
                <option value="cancelled">Отменено</option>
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

      {/* Модальное окно экспорта */}
      <div className={`modal ${showExportModal ? 'show' : ''}`} onClick={() => setShowExportModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Экспорт отчета по грузоперевозкам</h2>
            <span className="close" onClick={() => setShowExportModal(false)}>&times;</span>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); }}>
            <div className="form-group">
              <label>Дата начала периода (опционально)</label>
              <input
                type="date"
                value={exportPeriod.startDate}
                onChange={(e) => setExportPeriod({ ...exportPeriod, startDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Дата окончания периода (опционально)</label>
              <input
                type="date"
                value={exportPeriod.endDate}
                onChange={(e) => setExportPeriod({ ...exportPeriod, endDate: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                type="button" 
                className="btn btn-success" 
                onClick={() => handleExport('excel')}
                disabled={exporting}
              >
                {exporting ? 'Экспорт...' : '📊 Excel'}
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={() => handleExport('pdf')}
                disabled={exporting}
              >
                {exporting ? 'Экспорт...' : '📄 PDF'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowExportModal(false)}
                style={{ marginLeft: 'auto' }}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Shipments;
