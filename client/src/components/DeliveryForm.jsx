import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createDelivery, updateDelivery } from '../store/slices/deliveriesSlice';
import './Form.css';

function DeliveryForm({ delivery, drivers = [], vehicles = [], onClose }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (delivery) {
      reset({
        ...delivery,
        driver: delivery.driver?._id || delivery.driver,
        vehicle: delivery.vehicle?._id || delivery.vehicle,
        scheduledDate: delivery.scheduledDate
          ? new Date(delivery.scheduledDate).toISOString().slice(0, 16)
          : '',
        actualStartDate: delivery.actualStartDate
          ? new Date(delivery.actualStartDate).toISOString().slice(0, 16)
          : '',
        actualEndDate: delivery.actualEndDate
          ? new Date(delivery.actualEndDate).toISOString().slice(0, 16)
          : '',
        'origin.address': delivery.origin?.address || '',
        'origin.city': delivery.origin?.city || '',
        'destination.address': delivery.destination?.address || '',
        'destination.city': delivery.destination?.city || '',
        'cargo.description': delivery.cargo?.description || '',
        'cargo.weight': delivery.cargo?.weight || '',
        'cargo.volume': delivery.cargo?.volume || '',
      });
    }
  }, [delivery, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = {
        driver: data.driver,
        vehicle: data.vehicle,
        origin: {
          address: data['origin.address'],
          city: data['origin.city'],
        },
        destination: {
          address: data['destination.address'],
          city: data['destination.city'],
        },
        cargo: {
          description: data['cargo.description'],
          weight: parseFloat(data['cargo.weight']),
          weightUnit: data['cargo.weightUnit'] || 'kg',
          volume: data['cargo.volume'] ? parseFloat(data['cargo.volume']) : undefined,
          volumeUnit: data['cargo.volumeUnit'] || 'cubic_meters',
        },
        scheduledDate: new Date(data.scheduledDate),
        actualStartDate: data.actualStartDate ? new Date(data.actualStartDate) : undefined,
        actualEndDate: data.actualEndDate ? new Date(data.actualEndDate) : undefined,
        status: data.status,
        distance: data.distance ? parseFloat(data.distance) : undefined,
        distanceUnit: data.distanceUnit || 'km',
        cost: data.cost ? parseFloat(data.cost) : undefined,
        currency: data.currency || 'RUB',
        notes: data.notes || '',
      };

      if (delivery) {
        await dispatch(updateDelivery({ id: delivery._id, data: formData })).unwrap();
        toast.success('Доставка успешно обновлена');
      } else {
        await dispatch(createDelivery(formData)).unwrap();
        toast.success('Доставка успешно создана');
      }
      onClose();
    } catch (error) {
      toast.error(error.message || 'Произошла ошибка');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="form-modal large" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h3>{delivery ? 'Редактировать доставку' : 'Добавить доставку'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Водитель *</label>
              <select
                {...register('driver', { required: 'Водитель обязателен' })}
              >
                <option value="">Выберите водителя</option>
                {drivers.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.firstName} {driver.lastName} ({driver.licenseNumber})
                  </option>
                ))}
              </select>
              {errors.driver && (
                <span className="error">{errors.driver.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Транспорт *</label>
              <select
                {...register('vehicle', { required: 'Транспорт обязателен' })}
              >
                <option value="">Выберите транспорт</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
                  </option>
                ))}
              </select>
              {errors.vehicle && (
                <span className="error">{errors.vehicle.message}</span>
              )}
            </div>
          </div>

          <div className="form-section">
            <h4>Точка отправления</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Город *</label>
                <input
                  type="text"
                  {...register('origin.city', { required: 'Город обязателен' })}
                />
                {errors['origin.city'] && (
                  <span className="error">{errors['origin.city'].message}</span>
                )}
              </div>
              <div className="form-group">
                <label>Адрес *</label>
                <input
                  type="text"
                  {...register('origin.address', { required: 'Адрес обязателен' })}
                />
                {errors['origin.address'] && (
                  <span className="error">{errors['origin.address'].message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Точка назначения</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Город *</label>
                <input
                  type="text"
                  {...register('destination.city', { required: 'Город обязателен' })}
                />
                {errors['destination.city'] && (
                  <span className="error">{errors['destination.city'].message}</span>
                )}
              </div>
              <div className="form-group">
                <label>Адрес *</label>
                <input
                  type="text"
                  {...register('destination.address', { required: 'Адрес обязателен' })}
                />
                {errors['destination.address'] && (
                  <span className="error">{errors['destination.address'].message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Груз</h4>
            <div className="form-group">
              <label>Описание *</label>
              <input
                type="text"
                {...register('cargo.description', { required: 'Описание обязательно' })}
              />
              {errors['cargo.description'] && (
                <span className="error">{errors['cargo.description'].message}</span>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Вес *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('cargo.weight', {
                    required: 'Вес обязателен',
                    min: { value: 0, message: 'Не может быть отрицательным' },
                  })}
                />
                {errors['cargo.weight'] && (
                  <span className="error">{errors['cargo.weight'].message}</span>
                )}
              </div>
              <div className="form-group">
                <label>Единица веса</label>
                <select {...register('cargo.weightUnit')}>
                  <option value="kg">кг</option>
                  <option value="tons">тонны</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Объем</label>
                <input type="number" step="0.01" {...register('cargo.volume')} />
              </div>
              <div className="form-group">
                <label>Единица объема</label>
                <select {...register('cargo.volumeUnit')}>
                  <option value="cubic_meters">м³</option>
                  <option value="liters">литры</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Запланированная дата *</label>
              <input
                type="datetime-local"
                {...register('scheduledDate', { required: 'Дата обязательна' })}
              />
              {errors.scheduledDate && (
                <span className="error">{errors.scheduledDate.message}</span>
              )}
            </div>
            <div className="form-group">
              <label>Статус</label>
              <select {...register('status')}>
                <option value="scheduled">Запланирована</option>
                <option value="in_transit">В пути</option>
                <option value="delivered">Доставлена</option>
                <option value="cancelled">Отменена</option>
                <option value="delayed">Задержана</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Фактическая дата начала</label>
              <input type="datetime-local" {...register('actualStartDate')} />
            </div>
            <div className="form-group">
              <label>Фактическая дата окончания</label>
              <input type="datetime-local" {...register('actualEndDate')} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Расстояние</label>
              <input
                type="number"
                step="0.01"
                {...register('distance', {
                  min: { value: 0, message: 'Не может быть отрицательным' },
                })}
              />
            </div>
            <div className="form-group">
              <label>Единица расстояния</label>
              <select {...register('distanceUnit')}>
                <option value="km">км</option>
                <option value="miles">мили</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Стоимость</label>
              <input
                type="number"
                step="0.01"
                {...register('cost', {
                  min: { value: 0, message: 'Не может быть отрицательной' },
                })}
              />
            </div>
            <div className="form-group">
              <label>Валюта</label>
              <select {...register('currency')}>
                <option value="RUB">RUB</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Примечания</label>
            <textarea
              rows="3"
              {...register('notes', {
                maxLength: { value: 1000, message: 'Максимум 1000 символов' },
              })}
            />
            {errors.notes && (
              <span className="error">{errors.notes.message}</span>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {delivery ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeliveryForm;
