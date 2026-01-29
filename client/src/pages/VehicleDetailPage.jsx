import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchVehicleById } from '../store/slices/vehiclesSlice';
import { vehiclesAPI } from '../services/api';
import './DetailPage.css';

function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentItem, loading } = useSelector((state) => state.vehicles);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchVehicleById(id));
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
      await vehiclesAPI.uploadPhoto(id, file);
      toast.success('Фото успешно загружено');
      dispatch(fetchVehicleById(id));
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
        <p>Транспорт не найден</p>
        <Link to="/vehicles" className="btn btn-primary">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  const vehicleTypes = {
    truck: 'Грузовик',
    van: 'Фургон',
    car: 'Автомобиль',
    trailer: 'Прицеп',
  };

  const statuses = {
    available: 'Доступен',
    in_use: 'В использовании',
    maintenance: 'На обслуживании',
    out_of_service: 'Не в эксплуатации',
  };

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <h2>Транспорт: {currentItem.licensePlate}</h2>
      </div>

      <div className="detail-content">
        <div className="detail-photo-section">
          <div className="photo-container">
            {currentItem.photoUrl ? (
              <img
                src={`http://localhost:3000${currentItem.photoUrl}`}
                alt={currentItem.licensePlate}
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
                <span className="info-label">Номерной знак:</span>
                <span className="info-value">{currentItem.licensePlate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Марка:</span>
                <span className="info-value">{currentItem.brand}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Модель:</span>
                <span className="info-value">{currentItem.model}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Год выпуска:</span>
                <span className="info-value">{currentItem.year}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Тип:</span>
                <span className="info-value">
                  {vehicleTypes[currentItem.vehicleType] || currentItem.vehicleType}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Статус:</span>
                <span className="info-value">
                  {statuses[currentItem.status] || currentItem.status}
                </span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Характеристики</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Грузоподъемность:</span>
                <span className="info-value">
                  {currentItem.capacity} {currentItem.capacityUnit}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Пробег:</span>
                <span className="info-value">
                  {currentItem.mileage?.toLocaleString() || 0} км
                </span>
              </div>
              {currentItem.lastMaintenanceDate && (
                <div className="info-item">
                  <span className="info-label">Последнее ТО:</span>
                  <span className="info-value">
                    {new Date(currentItem.lastMaintenanceDate).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="info-section">
            <h3>Даты</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Создано:</span>
                <span className="info-value">
                  {new Date(currentItem.createdAt).toLocaleString('ru-RU')}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Обновлено:</span>
                <span className="info-value">
                  {new Date(currentItem.updatedAt).toLocaleString('ru-RU')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetailPage;
