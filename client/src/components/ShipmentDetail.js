import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShipmentById, clearCurrentItem } from '../store/slices/shipmentsSlice';
import { ToastContainer } from 'react-toastify';

function ShipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentItem, loading, error } = useSelector(state => state.shipments);

  useEffect(() => {
    dispatch(fetchShipmentById(id));
    return () => {
      dispatch(clearCurrentItem());
    };
  }, [id, dispatch]);

  if (loading) {
    return <div className="card"><div>Загрузка...</div></div>;
  }

  if (error || !currentItem) {
    return (
      <div className="card">
        <div className="error">Грузоперевозка не найдена</div>
        <button className="btn btn-secondary" onClick={() => navigate('/shipments')} style={{ marginTop: '20px' }}>
          Вернуться к списку
        </button>
      </div>
    );
  }

  const defaultImage = 'https://via.placeholder.com/500x300?text=Shipment+Photo';

  return (
    <div>
      <ToastContainer />
      <div className="card">
        <div className="card-header">
          <h2>Детальная информация о грузоперевозке</h2>
          <button className="btn btn-secondary" onClick={() => navigate('/shipments')}>
            Вернуться к списку
          </button>
        </div>

        <div className="detail-view">
          <div>
            <img
              src={currentItem.photoUrl || defaultImage}
              alt="Грузоперевозка"
              className="detail-image"
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
          </div>
          <div className="detail-info">
            <div className="detail-field">
              <label>ID</label>
              <span>{currentItem.id}</span>
            </div>
            <div className="detail-field">
              <label>Транспортное средство</label>
              <span>
                {currentItem.vehicle 
                  ? `${currentItem.vehicle.brand} ${currentItem.vehicle.model} (${currentItem.vehicle.licensePlate})`
                  : 'N/A'}
              </span>
            </div>
            <div className="detail-field">
              <label>Маршрут</label>
              <span>
                {currentItem.route 
                  ? `${currentItem.route.name}: ${currentItem.route.origin} → ${currentItem.route.destination}`
                  : 'N/A'}
              </span>
            </div>
            <div className="detail-field">
              <label>Описание груза</label>
              <span>{currentItem.cargoDescription}</span>
            </div>
            <div className="detail-field">
              <label>Вес</label>
              <span>{currentItem.weight} тонн</span>
            </div>
            <div className="detail-field">
              <label>Статус</label>
              <span>{currentItem.status}</span>
            </div>
            <div className="detail-field">
              <label>Дата отправления</label>
              <span>{currentItem.departureDate ? new Date(currentItem.departureDate).toLocaleString('ru-RU') : 'N/A'}</span>
            </div>
            <div className="detail-field">
              <label>Дата доставки</label>
              <span>{currentItem.deliveryDate ? new Date(currentItem.deliveryDate).toLocaleString('ru-RU') : 'N/A'}</span>
            </div>
            <div className="detail-field">
              <label>Дата создания</label>
              <span>{new Date(currentItem.createdAt).toLocaleString('ru-RU')}</span>
            </div>
            <div className="detail-field">
              <label>Дата обновления</label>
              <span>{new Date(currentItem.updatedAt).toLocaleString('ru-RU')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShipmentDetail;
