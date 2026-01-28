import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicles } from '../store/slices/vehiclesSlice';
import { fetchRoutes } from '../store/slices/routesSlice';
import { createShipment, updateShipment } from '../store/slices/shipmentsSlice';
import { toast } from 'react-toastify';
import api from '../services/api';

// Схема валидации
const shipmentSchema = yup.object().shape({
  vehicleId: yup.number().required('Транспортное средство обязательно'),
  routeId: yup.number().required('Маршрут обязателен'),
  cargoDescription: yup.string().required('Описание груза обязательно').min(10, 'Минимум 10 символов'),
  weight: yup.number().required('Вес обязателен').positive('Вес должен быть положительным').max(100, 'Максимальный вес 100 тонн'),
  status: yup.string().required('Статус обязателен').oneOf(['pending', 'in_transit', 'delivered', 'cancelled']),
  departureDate: yup.date().required('Дата отправления обязательна').nullable(),
  deliveryDate: yup.date().nullable().test('delivery-after-departure', 'Дата доставки должна быть после даты отправления', function(value) {
    const { departureDate } = this.parent;
    if (!value || !departureDate) return true;
    return new Date(value) >= new Date(departureDate);
  }),
  photoUrl: yup.string().url('Неверный URL фотографии').nullable(),
  priority: yup.string().oneOf(['low', 'medium', 'high']).required('Приоритет обязателен'),
  insuranceValue: yup.number().positive('Страховая стоимость должна быть положительной').nullable(),
  notes: yup.string().max(500, 'Максимум 500 символов').nullable()
});

function ShipmentForm({ shipment, onClose }) {
  const dispatch = useDispatch();
  const { items: vehicles } = useSelector(state => state.vehicles);
  const { items: routes } = useSelector(state => state.routes);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isCheckingVehicle, setIsCheckingVehicle] = useState(false);
  const [vehicleAvailable, setVehicleAvailable] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(shipmentSchema),
    defaultValues: shipment || {
      vehicleId: '',
      routeId: '',
      cargoDescription: '',
      weight: '',
      status: 'pending',
      departureDate: null,
      deliveryDate: null,
      photoUrl: '',
      priority: 'medium',
      insuranceValue: '',
      notes: ''
    }
  });

  const watchedVehicleId = watch('vehicleId');
  const watchedRouteId = watch('routeId');
  const watchedWeight = watch('weight');
  const watchedDepartureDate = watch('departureDate');

  useEffect(() => {
    dispatch(fetchVehicles());
    dispatch(fetchRoutes());
  }, [dispatch]);

  useEffect(() => {
    if (watchedRouteId) {
      const route = routes.find(r => r.id === parseInt(watchedRouteId));
      setSelectedRoute(route);
      if (route) {
        // Автоматическое заполнение даты доставки на основе времени маршрута
        if (watchedDepartureDate && route.estimatedTime) {
          const deliveryDate = new Date(watchedDepartureDate);
          deliveryDate.setMinutes(deliveryDate.getMinutes() + route.estimatedTime);
          setValue('deliveryDate', deliveryDate);
        }
      }
    }
  }, [watchedRouteId, routes, watchedDepartureDate, setValue]);

  // Асинхронная валидация доступности транспортного средства
  useEffect(() => {
    const checkVehicleAvailability = async () => {
      if (watchedVehicleId && watchedDepartureDate) {
        setIsCheckingVehicle(true);
        try {
          const response = await api.get(`/vehicles/${watchedVehicleId}/check-availability`, {
            params: {
              date: watchedDepartureDate.toISOString()
            }
          });
          setVehicleAvailable(response.data.available);
          if (!response.data.available) {
            toast.warning('Транспортное средство недоступно на выбранную дату');
          }
        } catch (error) {
          console.error('Ошибка проверки доступности:', error);
        } finally {
          setIsCheckingVehicle(false);
        }
      }
    };

    const timeoutId = setTimeout(checkVehicleAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedVehicleId, watchedDepartureDate]);

  // Автоматический расчет рекомендуемого веса на основе грузоподъемности транспорта
  useEffect(() => {
    if (watchedVehicleId && vehicles.length > 0) {
      const vehicle = vehicles.find(v => v.id === parseInt(watchedVehicleId));
      if (vehicle && !watchedWeight) {
        // Установить максимальный вес как подсказку
        const maxWeight = parseFloat(vehicle.capacity);
        if (maxWeight) {
          setValue('weight', maxWeight * 0.8); // 80% от грузоподъемности как рекомендуемое значение
        }
      }
    }
  }, [watchedVehicleId, vehicles, watchedWeight, setValue]);

  const onSubmit = async (data) => {
    try {
      const shipmentData = {
        ...data,
        departureDate: data.departureDate?.toISOString(),
        deliveryDate: data.deliveryDate?.toISOString() || null,
        vehicleId: parseInt(data.vehicleId),
        routeId: parseInt(data.routeId),
        weight: parseFloat(data.weight),
        insuranceValue: data.insuranceValue ? parseFloat(data.insuranceValue) : null
      };

      if (shipment) {
        await dispatch(updateShipment({ id: shipment.id, ...shipmentData })).unwrap();
        toast.success('Грузоперевозка обновлена');
      } else {
        await dispatch(createShipment(shipmentData)).unwrap();
        toast.success('Грузоперевозка создана');
      }
      onClose();
    } catch (error) {
      toast.error(error.message || 'Ошибка при сохранении грузоперевозки');
    }
  };

  const selectedVehicle = vehicles.find(v => v.id === parseInt(watchedVehicleId));
  const availableVehicles = vehicles.filter(v => v.status === 'available');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="shipment-form">
      <div className="form-section">
        <h3>Основная информация</h3>
        
        <div className="form-group">
          <label>Транспортное средство *</label>
          <select {...register('vehicleId')} className={errors.vehicleId ? 'error' : ''}>
            <option value="">Выберите транспорт</option>
            {availableVehicles.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} ({vehicle.licensePlate}) - {vehicle.capacity} т
              </option>
            ))}
          </select>
          {errors.vehicleId && <div className="form-error">{errors.vehicleId.message}</div>}
          {isCheckingVehicle && <div className="form-info">Проверка доступности...</div>}
          {watchedVehicleId && !vehicleAvailable && !isCheckingVehicle && (
            <div className="form-error">Транспортное средство недоступно на выбранную дату</div>
          )}
          {selectedVehicle && (
            <div className="form-info">
              Грузоподъемность: {selectedVehicle.capacity} т, Тип: {selectedVehicle.vehicleType}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Маршрут *</label>
          <select {...register('routeId')} className={errors.routeId ? 'error' : ''}>
            <option value="">Выберите маршрут</option>
            {routes.filter(r => r.status === 'active').map(route => (
              <option key={route.id} value={route.id}>
                {route.name || `${route.origin} → ${route.destination}`} ({route.distance} км, {route.estimatedTime} мин)
              </option>
            ))}
          </select>
          {errors.routeId && <div className="form-error">{errors.routeId.message}</div>}
          {selectedRoute && (
            <div className="form-info">
              Расстояние: {selectedRoute.distance} км, Время: {selectedRoute.estimatedTime} мин
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Описание груза *</label>
          <textarea
            {...register('cargoDescription')}
            rows={4}
            className={errors.cargoDescription ? 'error' : ''}
            placeholder="Подробное описание груза..."
          />
          {errors.cargoDescription && <div className="form-error">{errors.cargoDescription.message}</div>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Вес (тонны) *</label>
            <input
              type="number"
              step="0.01"
              {...register('weight')}
              className={errors.weight ? 'error' : ''}
              placeholder="0.00"
            />
            {errors.weight && <div className="form-error">{errors.weight.message}</div>}
            {selectedVehicle && (
              <div className="form-info">
                Максимум: {selectedVehicle.capacity} т
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Приоритет *</label>
            <select {...register('priority')} className={errors.priority ? 'error' : ''}>
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
            {errors.priority && <div className="form-error">{errors.priority.message}</div>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Даты и статус</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Дата отправления *</label>
            <Controller
              control={control}
              name="departureDate"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  showTimeSelect
                  dateFormat="dd.MM.yyyy HH:mm"
                  minDate={new Date()}
                  className={errors.departureDate ? 'error' : ''}
                  placeholderText="Выберите дату и время"
                />
              )}
            />
            {errors.departureDate && <div className="form-error">{errors.departureDate.message}</div>}
          </div>

          <div className="form-group">
            <label>Дата доставки</label>
            <Controller
              control={control}
              name="deliveryDate"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  showTimeSelect
                  dateFormat="dd.MM.yyyy HH:mm"
                  minDate={watchedDepartureDate || new Date()}
                  className={errors.deliveryDate ? 'error' : ''}
                  placeholderText="Выберите дату и время"
                />
              )}
            />
            {errors.deliveryDate && <div className="form-error">{errors.deliveryDate.message}</div>}
          </div>
        </div>

        <div className="form-group">
          <label>Статус *</label>
          <select {...register('status')} className={errors.status ? 'error' : ''}>
            <option value="pending">Ожидает</option>
            <option value="in_transit">В пути</option>
            <option value="delivered">Доставлено</option>
            <option value="cancelled">Отменено</option>
          </select>
          {errors.status && <div className="form-error">{errors.status.message}</div>}
        </div>
      </div>

      <div className="form-section">
        <h3>Дополнительная информация</h3>
        
        <div className="form-group">
          <label>URL фотографии</label>
          <input
            type="url"
            {...register('photoUrl')}
            className={errors.photoUrl ? 'error' : ''}
            placeholder="https://example.com/photo.jpg"
          />
          {errors.photoUrl && <div className="form-error">{errors.photoUrl.message}</div>}
        </div>

        <div className="form-group">
          <label>Страховая стоимость (руб.)</label>
          <input
            type="number"
            step="0.01"
            {...register('insuranceValue')}
            className={errors.insuranceValue ? 'error' : ''}
            placeholder="0.00"
          />
          {errors.insuranceValue && <div className="form-error">{errors.insuranceValue.message}</div>}
        </div>

        <div className="form-group">
          <label>Примечания</label>
          <textarea
            {...register('notes')}
            rows={3}
            className={errors.notes ? 'error' : ''}
            placeholder="Дополнительные примечания..."
          />
          {errors.notes && <div className="form-error">{errors.notes.message}</div>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting || !vehicleAvailable}>
          {isSubmitting ? 'Сохранение...' : shipment ? 'Обновить' : 'Создать'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Отмена
        </button>
      </div>
    </form>
  );
}

export default ShipmentForm;
