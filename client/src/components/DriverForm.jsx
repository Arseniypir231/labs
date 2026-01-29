import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createDriver, updateDriver } from '../store/slices/driversSlice';
import './Form.css';

function DriverForm({ driver, onClose }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [selectedCategories, setSelectedCategories] = useState(
    driver?.licenseCategory || []
  );

  useEffect(() => {
    if (driver) {
      reset({
        ...driver,
        hireDate: driver.hireDate
          ? new Date(driver.hireDate).toISOString().split('T')[0]
          : '',
      });
      setSelectedCategories(driver.licenseCategory || []);
    }
  }, [driver, reset]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        licenseCategory: selectedCategories,
        address: {
          street: data.street || '',
          city: data.city || '',
          zipCode: data.zipCode || '',
        },
      };
      delete formData.street;
      delete formData.zipCode;

      if (driver) {
        await dispatch(updateDriver({ id: driver._id, data: formData })).unwrap();
        toast.success('Водитель успешно обновлен');
      } else {
        await dispatch(createDriver(formData)).unwrap();
        toast.success('Водитель успешно создан');
      }
      onClose();
    } catch (error) {
      toast.error(error.message || 'Произошла ошибка');
    }
  };

  const categories = ['B', 'C', 'CE', 'D', 'DE'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h3>{driver ? 'Редактировать водителя' : 'Добавить водителя'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Имя *</label>
              <input
                type="text"
                {...register('firstName', {
                  required: 'Имя обязательно',
                  minLength: { value: 2, message: 'Минимум 2 символа' },
                })}
              />
              {errors.firstName && (
                <span className="error">{errors.firstName.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Фамилия *</label>
              <input
                type="text"
                {...register('lastName', {
                  required: 'Фамилия обязательна',
                  minLength: { value: 2, message: 'Минимум 2 символа' },
                })}
              />
              {errors.lastName && (
                <span className="error">{errors.lastName.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Телефон *</label>
              <input
                type="text"
                {...register('phone', {
                  required: 'Телефон обязателен',
                  pattern: {
                    value: /^(\+7|8)\d{10}$/,
                    message: 'Неверный формат (пример: +79123456789)',
                  },
                })}
              />
              {errors.phone && (
                <span className="error">{errors.phone.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email обязателен',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Неверный формат email',
                  },
                })}
              />
              {errors.email && (
                <span className="error">{errors.email.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Номер водительского удостоверения *</label>
              <input
                type="text"
                {...register('licenseNumber', {
                  required: 'Номер прав обязателен',
                  pattern: {
                    value: /^\d{2}[АВЕКМНОРСТУХ]{2}\d{6}$/,
                    message: 'Неверный формат (пример: 77АВ123456)',
                  },
                })}
              />
              {errors.licenseNumber && (
                <span className="error">{errors.licenseNumber.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Опыт работы (лет) *</label>
              <input
                type="number"
                {...register('experience', {
                  required: 'Опыт обязателен',
                  min: { value: 0, message: 'Не может быть отрицательным' },
                  max: { value: 50, message: 'Слишком большой опыт' },
                })}
              />
              {errors.experience && (
                <span className="error">{errors.experience.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Категории прав *</label>
            <div className="checkbox-group">
              {categories.map((cat) => (
                <label key={cat} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
            {selectedCategories.length === 0 && (
              <span className="error">Выберите хотя бы одну категорию</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Город *</label>
              <input
                type="text"
                {...register('city', { required: 'Город обязателен' })}
              />
              {errors.city && (
                <span className="error">{errors.city.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Улица</label>
              <input type="text" {...register('street')} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Дата найма *</label>
              <input
                type="date"
                {...register('hireDate', { required: 'Дата найма обязательна' })}
              />
              {errors.hireDate && (
                <span className="error">{errors.hireDate.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Статус</label>
              <select {...register('status')}>
                <option value="available">Доступен</option>
                <option value="on_delivery">В рейсе</option>
                <option value="sick_leave">На больничном</option>
                <option value="vacation">В отпуске</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {driver ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DriverForm;
