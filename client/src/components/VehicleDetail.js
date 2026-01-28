import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicleById, clearCurrentItem } from '../store/slices/vehiclesSlice';
import { ToastContainer } from 'react-toastify';

function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentItem, loading, error } = useSelector(state => state.vehicles);

  useEffect(() => {
    dispatch(fetchVehicleById(id));
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
        <div className="error">Транспортное средство не найдено</div>
        <button className="btn btn-secondary" onClick={() => navigate('/vehicles')} style={{ marginTop: '20px' }}>
          Вернуться к списку
        </button>
      </div>
    );
  }

  const defaultImage = 'https://via.placeholder.com/500x300?text=Vehicle+Photo';

  return (
    <div>
      <ToastContainer />
      <div className="card">
        <div className="card-header">
          <h2>Детальная информация о транспортном средстве</h2>
          <button className="btn btn-secondary" onClick={() => navigate('/vehicles')}>
            Вернуться к списку
          </button>
        </div>

        <div className="detail-view">
          <div>
            <img
              src={currentItem.photoUrl || defaultImage}
              alt={`${currentItem.brand} ${currentItem.model}`}
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
              <label>Номерной знак</label>
              <span>{currentItem.licensePlate}</span>
            </div>
            <div className="detail-field">
              <label>Марка</label>
              <span>{currentItem.brand}</span>
            </div>
            <div className="detail-field">
              <label>Модель</label>
              <span>{currentItem.model}</span>
            </div>
            <div className="detail-field">
              <label>Тип транспортного средства</label>
              <span>{currentItem.vehicleType}</span>
            </div>
            <div className="detail-field">
              <label>Грузоподъемность</label>
              <span>{currentItem.capacity} тонн</span>
            </div>
            <div className="detail-field">
              <label>Год выпуска</label>
              <span>{currentItem.year}</span>
            </div>
            <div className="detail-field">
              <label>Статус</label>
              <span>{currentItem.status}</span>
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

export default VehicleDetail;
