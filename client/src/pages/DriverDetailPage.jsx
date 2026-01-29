import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchDriverById } from '../store/slices/driversSlice';
import { driversAPI } from '../services/api';
import './DetailPage.css';

function DriverDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentItem, loading } = useSelector((state) => state.drivers);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchDriverById(id));
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
      await driversAPI.uploadPhoto(id, file);
      toast.success('Фото успешно загружено');
      dispatch(fetchDriverById(id));
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
        <p>Водитель не найден</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Вернуться назад
        </button>
      </div>
    );
  }

  const statuses = {
    available: 'Доступен',
    on_delivery: 'В рейсе',
    sick_leave: 'На больничном',
    vacation: 'В отпуске',
  };

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <h2>
          {currentItem.firstName} {currentItem.lastName}
        </h2>
      </div>

      <div className="detail-content">
        <div className="detail-photo-section">
          <div className="photo-container">
            {currentItem.photoUrl ? (
              <img
                src={`http://localhost:3000${currentItem.photoUrl}`}
                alt={`${currentItem.firstName} ${currentItem.lastName}`}
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
            <h3>Личная информация</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Имя:</span>
                <span className="info-value">{currentItem.firstName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Фамилия:</span>
                <span className="info-value">{currentItem.lastName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Телефон:</span>
                <span className="info-value">{currentItem.phone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{currentItem.email}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Водительское удостоверение</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Номер:</span>
                <span className="info-value">{currentItem.licenseNumber}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Категории:</span>
                <span className="info-value">
                  {Array.isArray(currentItem.licenseCategory)
                    ? currentItem.licenseCategory.join(', ')
                    : currentItem.licenseCategory}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Опыт работы:</span>
                <span className="info-value">{currentItem.experience} лет</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Работа</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Статус:</span>
                <span className="info-value">
                  {statuses[currentItem.status] || currentItem.status}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Дата найма:</span>
                <span className="info-value">
                  {new Date(currentItem.hireDate).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
          </div>

          {currentItem.address && (
            <div className="info-section">
              <h3>Адрес</h3>
              <div className="info-grid">
                {currentItem.address.city && (
                  <div className="info-item">
                    <span className="info-label">Город:</span>
                    <span className="info-value">{currentItem.address.city}</span>
                  </div>
                )}
                {currentItem.address.street && (
                  <div className="info-item">
                    <span className="info-label">Улица:</span>
                    <span className="info-value">{currentItem.address.street}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DriverDetailPage;
