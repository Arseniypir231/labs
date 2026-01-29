import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchDeliveryById } from '../store/slices/deliveriesSlice';
import { deliveriesAPI } from '../services/api';
import './DetailPage.css';

function DeliveryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentItem, loading } = useSelector((state) => state.deliveries);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchDeliveryById(id));
  }, [dispatch, id]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Выберите файл изображения');
      return;
    }

    setUploading(true);
    try {
      await deliveriesAPI.uploadPhoto(id, file);
      toast.success('Фото успешно загружено');
      dispatch(fetchDeliveryById(id));
    } catch (error) {
      console.error('Ошибка загрузки фото:', error);
      toast.error(error.response?.data?.message || 'Ошибка при загрузке фото');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!currentItem) {
    return (
      <div className="error-state">
        <p>Доставка не найдена</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Вернуться назад
        </button>
      </div>
    );
  }

  const statuses = {
    scheduled: 'Запланирована',
    in_transit: 'В пути',
    delivered: 'Доставлена',
    cancelled: 'Отменена',
    delayed: 'Задержана',
  };

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <h2>Доставка: {currentItem.deliveryNumber}</h2>
      </div>

      <div className="detail-content">
        <div className="detail-photo-section">
          <div className="photo-container">
            {currentItem.photoUrl ? (
              <img
                src={`http://localhost:3000${currentItem.photoUrl}`}
                alt={currentItem.deliveryNumber}
                className="detail-photo"
              />
            ) : (
              <div className="photo-placeholder">
                <span>Нет фото</span>
              </div>
            )}
          </div>
          <label className="btn btn-primary photo-upload-btn">
            {uploading ? 'Загрузка...' : 'Загрузить фото'}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="detail-info">
          <div className="info-section">
            <h3>Основная информация</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Номер доставки:</span>
                <span className="info-value">{currentItem.deliveryNumber}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Статус:</span>
                <span className="info-value">
                  {statuses[currentItem.status] || currentItem.status}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Запланированная дата:</span>
                <span className="info-value">
                  {new Date(currentItem.scheduledDate).toLocaleString('ru-RU')}
                </span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Водитель и транспорт</h3>
            <div className="info-grid">
              {currentItem.driver && (
                <div className="info-item">
                  <span className="info-label">Водитель:</span>
                  <span className="info-value">
                    {typeof currentItem.driver === 'object'
                      ? `${currentItem.driver.firstName} ${currentItem.driver.lastName}`
                      : '-'}
                  </span>
                </div>
              )}
              {currentItem.vehicle && (
                <div className="info-item">
                  <span className="info-label">Транспорт:</span>
                  <span className="info-value">
                    {typeof currentItem.vehicle === 'object'
                      ? `${currentItem.vehicle.brand} ${currentItem.vehicle.model} (${currentItem.vehicle.licensePlate})`
                      : '-'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="info-section">
            <h3>Маршрут</h3>
            <div className="info-grid">
              {currentItem.origin && (
                <>
                  <div className="info-item">
                    <span className="info-label">Откуда (город):</span>
                    <span className="info-value">{currentItem.origin.city}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Откуда (адрес):</span>
                    <span className="info-value">{currentItem.origin.address}</span>
                  </div>
                </>
              )}
              {currentItem.destination && (
                <>
                  <div className="info-item">
                    <span className="info-label">Куда (город):</span>
                    <span className="info-value">{currentItem.destination.city}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Куда (адрес):</span>
                    <span className="info-value">{currentItem.destination.address}</span>
                  </div>
                </>
              )}
              {currentItem.distance && (
                <div className="info-item">
                  <span className="info-label">Расстояние:</span>
                  <span className="info-value">
                    {currentItem.distance} {currentItem.distanceUnit || 'км'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {currentItem.cargo && (
            <div className="info-section">
              <h3>Груз</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Описание:</span>
                  <span className="info-value">{currentItem.cargo.description}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Вес:</span>
                  <span className="info-value">
                    {currentItem.cargo.weight} {currentItem.cargo.weightUnit || 'kg'}
                  </span>
                </div>
                {currentItem.cargo.volume && (
                  <div className="info-item">
                    <span className="info-label">Объем:</span>
                    <span className="info-value">
                      {currentItem.cargo.volume} {currentItem.cargo.volumeUnit || 'м³'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {(currentItem.actualStartDate || currentItem.actualEndDate) && (
            <div className="info-section">
              <h3>Фактические даты</h3>
              <div className="info-grid">
                {currentItem.actualStartDate && (
                  <div className="info-item">
                    <span className="info-label">Дата начала:</span>
                    <span className="info-value">
                      {new Date(currentItem.actualStartDate).toLocaleString('ru-RU')}
                    </span>
                  </div>
                )}
                {currentItem.actualEndDate && (
                  <div className="info-item">
                    <span className="info-label">Дата окончания:</span>
                    <span className="info-value">
                      {new Date(currentItem.actualEndDate).toLocaleString('ru-RU')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentItem.cost && (
            <div className="info-section">
              <h3>Стоимость</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Сумма:</span>
                  <span className="info-value">
                    {currentItem.cost.toLocaleString()} {currentItem.currency || 'RUB'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {currentItem.notes && (
            <div className="info-section">
              <h3>Примечания</h3>
              <p className="notes-text">{currentItem.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeliveryDetailPage;
