import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRouteById, clearCurrentItem } from '../store/slices/routesSlice';
import { ToastContainer } from 'react-toastify';

function RouteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentItem, loading, error } = useSelector(state => state.routes);

  useEffect(() => {
    dispatch(fetchRouteById(id));
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
        <div className="error">Маршрут не найден</div>
        <button className="btn btn-secondary" onClick={() => navigate('/routes')} style={{ marginTop: '20px' }}>
          Вернуться к списку
        </button>
      </div>
    );
  }

  const defaultImage = 'https://via.placeholder.com/500x300?text=Route+Photo';

  return (
    <div>
      <ToastContainer />
      <div className="card">
        <div className="card-header">
          <h2>Детальная информация о маршруте</h2>
          <button className="btn btn-secondary" onClick={() => navigate('/routes')}>
            Вернуться к списку
          </button>
        </div>

        <div className="detail-view">
          <div>
            <img
              src={currentItem.photoUrl || defaultImage}
              alt={currentItem.name}
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
              <label>Название маршрута</label>
              <span>{currentItem.name}</span>
            </div>
            <div className="detail-field">
              <label>Точка отправления</label>
              <span>{currentItem.origin}</span>
            </div>
            <div className="detail-field">
              <label>Точка назначения</label>
              <span>{currentItem.destination}</span>
            </div>
            <div className="detail-field">
              <label>Расстояние</label>
              <span>{currentItem.distance} км</span>
            </div>
            <div className="detail-field">
              <label>Оценочное время</label>
              <span>{currentItem.estimatedTime} минут</span>
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

export default RouteDetail;
