import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { createRoute, updateRoute } from '../store/slices/routesSlice';
import { toast } from 'react-toastify';

// Схема валидации для мультишаговой формы
const routeSchema = yup.object().shape({
  name: yup.string().required('Название маршрута обязательно').min(3, 'Минимум 3 символа'),
  origin: yup.string().required('Точка отправления обязательна').min(2, 'Минимум 2 символа'),
  destination: yup.string().required('Точка назначения обязательна').min(2, 'Минимум 2 символа'),
  distance: yup.number().required('Расстояние обязательно').positive('Расстояние должно быть положительным'),
  estimatedTime: yup.number().required('Время в пути обязательно').positive('Время должно быть положительным'),
  status: yup.string().required('Статус обязателен').oneOf(['active', 'inactive', 'archived']),
  waypoints: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Название промежуточной точки обязательно'),
      distance: yup.number().required('Расстояние обязательно').positive(),
      estimatedTime: yup.number().required('Время обязательно').positive()
    })
  ),
  vehicleTypes: yup.array().min(1, 'Выберите хотя бы один тип транспорта').required(),
  restrictions: yup.string().max(500, 'Максимум 500 символов').nullable(),
  tollCost: yup.number().positive('Стоимость должна быть положительной').nullable(),
  fuelCost: yup.number().positive('Стоимость должна быть положительной').nullable()
});

// Опции для типов транспорта
const vehicleTypeOptions = [
  { value: 'truck', label: 'Грузовики' },
  { value: 'van', label: 'Фургоны' },
  { value: 'car', label: 'Автомобили' },
  { value: 'motorcycle', label: 'Мотоциклы' }
];

// Предустановленные города для autocomplete
const cityOptions = [
  { value: 'Москва', label: 'Москва' },
  { value: 'Санкт-Петербург', label: 'Санкт-Петербург' },
  { value: 'Новосибирск', label: 'Новосибирск' },
  { value: 'Екатеринбург', label: 'Екатеринбург' },
  { value: 'Казань', label: 'Казань' },
  { value: 'Нижний Новгород', label: 'Нижний Новгород' },
  { value: 'Челябинск', label: 'Челябинск' },
  { value: 'Самара', label: 'Самара' },
  { value: 'Омск', label: 'Омск' },
  { value: 'Ростов-на-Дону', label: 'Ростов-на-Дону' }
];

function RouteWizardForm({ route, onClose }) {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(routeSchema),
    mode: 'onChange',
    defaultValues: route || {
      name: '',
      origin: '',
      destination: '',
      distance: '',
      estimatedTime: '',
      status: 'active',
      waypoints: [],
      vehicleTypes: [],
      restrictions: '',
      tollCost: '',
      fuelCost: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'waypoints'
  });

  const watchedOrigin = watch('origin');
  const watchedDestination = watch('destination');
  const watchedDistance = watch('distance');
  const watchedWaypoints = watch('waypoints');

  // Автоматический расчет общего расстояния и времени
  React.useEffect(() => {
    if (watchedWaypoints && watchedWaypoints.length > 0) {
      const totalDistance = watchedWaypoints.reduce((sum, wp) => sum + (parseFloat(wp.distance) || 0), 0);
      const totalTime = watchedWaypoints.reduce((sum, wp) => sum + (parseFloat(wp.estimatedTime) || 0), 0);
      
      if (watchedDistance && totalDistance > 0) {
        // Обновить общее расстояние, если оно меньше суммы промежуточных точек
        if (parseFloat(watchedDistance) < totalDistance) {
          setValue('distance', totalDistance);
        }
      }
      
      if (totalTime > 0) {
        setValue('estimatedTime', totalTime);
      }
    }
  }, [watchedWaypoints, watchedDistance, setValue]);

  const onSubmit = async (data) => {
    try {
      const routeData = {
        ...data,
        distance: parseFloat(data.distance),
        estimatedTime: parseInt(data.estimatedTime),
        vehicleTypes: data.vehicleTypes.map(vt => vt.value),
        tollCost: data.tollCost ? parseFloat(data.tollCost) : null,
        fuelCost: data.fuelCost ? parseFloat(data.fuelCost) : null
      };

      if (route) {
        await dispatch(updateRoute({ id: route.id, ...routeData })).unwrap();
        toast.success('Маршрут обновлен');
      } else {
        await dispatch(createRoute(routeData)).unwrap();
        toast.success('Маршрут создан');
      }
      onClose();
    } catch (error) {
      toast.error(error.message || 'Ошибка при сохранении маршрута');
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const filterCities = (inputValue) => {
    return cityOptions.filter(city =>
      city.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const loadOptions = (inputValue) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(filterCities(inputValue));
      }, 300);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="route-wizard-form">
      {/* Индикатор шагов */}
      <div className="wizard-steps">
        {[1, 2, 3].map(step => (
          <div key={step} className={`wizard-step ${currentStep === step ? 'active' : currentStep > step ? 'completed' : ''}`}>
            <div className="step-number">{step}</div>
            <div className="step-label">
              {step === 1 && 'Основная информация'}
              {step === 2 && 'Промежуточные точки'}
              {step === 3 && 'Дополнительно'}
            </div>
          </div>
        ))}
      </div>

      {/* Шаг 1: Основная информация */}
      {currentStep === 1 && (
        <div className="wizard-step-content">
          <h3>Основная информация о маршруте</h3>
          
          <div className="form-group">
            <label>Название маршрута *</label>
            <input
              type="text"
              {...register('name')}
              className={errors.name ? 'error' : ''}
              placeholder="Например: Москва - Санкт-Петербург"
            />
            {errors.name && <div className="form-error">{errors.name.message}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Точка отправления *</label>
              <Controller
                control={control}
                name="origin"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={cityOptions}
                    isSearchable
                    placeholder="Выберите или введите город"
                    className={errors.origin ? 'error' : ''}
                    onChange={(option) => field.onChange(option ? option.value : '')}
                    value={cityOptions.find(c => c.value === field.value) || null}
                    filterOption={filterCities}
                    onInputChange={(inputValue) => {
                      if (inputValue && !cityOptions.find(c => c.value === inputValue)) {
                        // Позволить пользователю ввести свой город
                      }
                    }}
                  />
                )}
              />
              {errors.origin && <div className="form-error">{errors.origin.message}</div>}
            </div>

            <div className="form-group">
              <label>Точка назначения *</label>
              <Controller
                control={control}
                name="destination"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={cityOptions}
                    isSearchable
                    placeholder="Выберите или введите город"
                    className={errors.destination ? 'error' : ''}
                    onChange={(option) => field.onChange(option ? option.value : '')}
                    value={cityOptions.find(c => c.value === field.value) || null}
                    filterOption={filterCities}
                  />
                )}
              />
              {errors.destination && <div className="form-error">{errors.destination.message}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Расстояние (км) *</label>
              <input
                type="number"
                step="0.1"
                {...register('distance')}
                className={errors.distance ? 'error' : ''}
                placeholder="0.0"
              />
              {errors.distance && <div className="form-error">{errors.distance.message}</div>}
            </div>

            <div className="form-group">
              <label>Время в пути (минуты) *</label>
              <input
                type="number"
                {...register('estimatedTime')}
                className={errors.estimatedTime ? 'error' : ''}
                placeholder="0"
              />
              {errors.estimatedTime && <div className="form-error">{errors.estimatedTime.message}</div>}
            </div>
          </div>

          <div className="form-group">
            <label>Типы транспорта *</label>
            <Controller
              control={control}
              name="vehicleTypes"
              render={({ field }) => (
                <Select
                  {...field}
                  options={vehicleTypeOptions}
                  isMulti
                  placeholder="Выберите типы транспорта"
                  className={errors.vehicleTypes ? 'error' : ''}
                />
              )}
            />
            {errors.vehicleTypes && <div className="form-error">{errors.vehicleTypes.message}</div>}
          </div>

          <div className="form-group">
            <label>Статус *</label>
            <select {...register('status')} className={errors.status ? 'error' : ''}>
              <option value="active">Активен</option>
              <option value="inactive">Неактивен</option>
              <option value="archived">Архивирован</option>
            </select>
            {errors.status && <div className="form-error">{errors.status.message}</div>}
          </div>
        </div>
      )}

      {/* Шаг 2: Промежуточные точки */}
      {currentStep === 2 && (
        <div className="wizard-step-content">
          <h3>Промежуточные точки маршрута</h3>
          
          <div className="waypoints-list">
            {fields.map((field, index) => (
              <div key={field.id} className="waypoint-item">
                <div className="form-row">
                  <div className="form-group">
                    <label>Название точки {index + 1} *</label>
                    <input
                      type="text"
                      {...register(`waypoints.${index}.name`)}
                      className={errors.waypoints?.[index]?.name ? 'error' : ''}
                      placeholder="Название промежуточной точки"
                    />
                    {errors.waypoints?.[index]?.name && (
                      <div className="form-error">{errors.waypoints[index].name.message}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Расстояние от предыдущей точки (км) *</label>
                    <input
                      type="number"
                      step="0.1"
                      {...register(`waypoints.${index}.distance`)}
                      className={errors.waypoints?.[index]?.distance ? 'error' : ''}
                      placeholder="0.0"
                    />
                    {errors.waypoints?.[index]?.distance && (
                      <div className="form-error">{errors.waypoints[index].distance.message}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Время до точки (минуты) *</label>
                    <input
                      type="number"
                      {...register(`waypoints.${index}.estimatedTime`)}
                      className={errors.waypoints?.[index]?.estimatedTime ? 'error' : ''}
                      placeholder="0"
                    />
                    {errors.waypoints?.[index]?.estimatedTime && (
                      <div className="form-error">{errors.waypoints[index].estimatedTime.message}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => remove(index)}
                      style={{ marginTop: '25px' }}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => append({ name: '', distance: '', estimatedTime: '' })}
          >
            + Добавить промежуточную точку
          </button>

          {watchedWaypoints && watchedWaypoints.length > 0 && (
            <div className="form-info" style={{ marginTop: '20px' }}>
              Общее расстояние: {watchedWaypoints.reduce((sum, wp) => sum + (parseFloat(wp.distance) || 0), 0).toFixed(1)} км
              <br />
              Общее время: {watchedWaypoints.reduce((sum, wp) => sum + (parseFloat(wp.estimatedTime) || 0), 0)} мин
            </div>
          )}
        </div>
      )}

      {/* Шаг 3: Дополнительная информация */}
      {currentStep === 3 && (
        <div className="wizard-step-content">
          <h3>Дополнительная информация</h3>
          
          <div className="form-group">
            <label>Ограничения и особенности маршрута</label>
            <textarea
              {...register('restrictions')}
              rows={4}
              className={errors.restrictions ? 'error' : ''}
              placeholder="Ограничения по весу, габаритам, времени движения и т.д."
            />
            {errors.restrictions && <div className="form-error">{errors.restrictions.message}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Стоимость платных дорог (руб.)</label>
              <input
                type="number"
                step="0.01"
                {...register('tollCost')}
                className={errors.tollCost ? 'error' : ''}
                placeholder="0.00"
              />
              {errors.tollCost && <div className="form-error">{errors.tollCost.message}</div>}
            </div>

            <div className="form-group">
              <label>Расходы на топливо (руб.)</label>
              <input
                type="number"
                step="0.01"
                {...register('fuelCost')}
                className={errors.fuelCost ? 'error' : ''}
                placeholder="0.00"
              />
              {errors.fuelCost && <div className="form-error">{errors.fuelCost.message}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Кнопки навигации */}
      <div className="form-actions">
        {currentStep > 1 && (
          <button type="button" className="btn btn-secondary" onClick={prevStep}>
            Назад
          </button>
        )}
        {currentStep < totalSteps ? (
          <button type="button" className="btn btn-primary" onClick={nextStep}>
            Далее
          </button>
        ) : (
          <button type="submit" className="btn btn-primary" disabled={!isValid}>
            {route ? 'Обновить' : 'Создать'}
          </button>
        )}
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Отмена
        </button>
      </div>
    </form>
  );
}

export default RouteWizardForm;
