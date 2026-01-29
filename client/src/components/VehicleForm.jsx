import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createVehicle, updateVehicle } from '../store/slices/vehiclesSlice';
import './Form.css';

function VehicleForm({ vehicle, onClose }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (vehicle) {
      reset(vehicle);
    }
  }, [vehicle, reset]);

  const onSubmit = async (data) => {
    try {
      if (vehicle) {
        await dispatch(updateVehicle({ id: vehicle._id, data })).unwrap();
        toast.success('Транспорт успешно обновлен');
      } else {
        await dispatch(createVehicle(data)).unwrap();
        toast.success('Транспорт успешно создан');
      }
      onClose();
    } catch (error) {
      toast.error(error.message || 'Произошла ошибка');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h3>{vehicle ? 'Редактировать транспорт' : 'Добавить транспорт'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <label>Номерной знак *</label>
            <input
              type="text"
              {...register('licensePlate', {
                required: 'Номерной знак обязателен',
                pattern: {
                  value: /^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/,
                  message: 'Неверный формат номерного знака (пример: А123БВ777)',
                },
              })}
            />
            {errors.licensePlate && (
              <span className="error">{errors.licensePlate.message}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Марка *</label>
              <input
                type="text"
                {...register('brand', {
                  required: 'Марка обязательна',
                  minLength: { value: 2, message: 'Минимум 2 символа' },
                })}
              />
              {errors.brand && (
                <span className="error">{errors.brand.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Модель *</label>
              <input
                type="text"
                {...register('model', {
                  required: 'Модель обязательна',
                  minLength: { value: 1, message: 'Минимум 1 символ' },
                })}
              />
              {errors.model && (
                <span className="error">{errors.model.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Год выпуска *</label>
              <input
                type="number"
                {...register('year', {
                  required: 'Год обязателен',
                  min: { value: 1900, message: 'Год должен быть не менее 1900' },
                  max: {
                    value: new Date().getFullYear() + 1,
                    message: 'Год не может быть в будущем',
                  },
                })}
              />
              {errors.year && (
                <span className="error">{errors.year.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Тип транспорта *</label>
              <select
                {...register('vehicleType', { required: 'Тип обязателен' })}
              >
                <option value="">Выберите тип</option>
                <option value="truck">Грузовик</option>
                <option value="van">Фургон</option>
                <option value="car">Автомобиль</option>
                <option value="trailer">Прицеп</option>
              </select>
              {errors.vehicleType && (
                <span className="error">{errors.vehicleType.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Грузоподъемность *</label>
              <input
                type="number"
                step="0.01"
                {...register('capacity', {
                  required: 'Грузоподъемность обязательна',
                  min: { value: 0, message: 'Не может быть отрицательной' },
                })}
              />
              {errors.capacity && (
                <span className="error">{errors.capacity.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Единица измерения *</label>
              <select
                {...register('capacityUnit', { required: 'Единица обязательна' })}
              >
                <option value="kg">кг</option>
                <option value="tons">тонны</option>
                <option value="cubic_meters">м³</option>
              </select>
              {errors.capacityUnit && (
                <span className="error">{errors.capacityUnit.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Статус</label>
            <select {...register('status')}>
              <option value="available">Доступен</option>
              <option value="in_use">В использовании</option>
              <option value="maintenance">На обслуживании</option>
              <option value="out_of_service">Не в эксплуатации</option>
            </select>
          </div>

          <div className="form-group">
            <label>Пробег</label>
            <input
              type="number"
              {...register('mileage', {
                min: { value: 0, message: 'Не может быть отрицательным' },
              })}
            />
            {errors.mileage && (
              <span className="error">{errors.mileage.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Дата последнего ТО</label>
            <input type="date" {...register('lastMaintenanceDate')} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {vehicle ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VehicleForm;
